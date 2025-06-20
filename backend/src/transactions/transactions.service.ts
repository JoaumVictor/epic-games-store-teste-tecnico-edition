import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { game: gameId, user: userId, amount, discountApplied } = dto;

    this.logger.info({
      message: `Attempting to create transaction`,
      gameId,
      userId,
      amount,
    });

    try {
      const game = await this.gamesService.findOne(gameId);
      if (!game) {
        this.logger.warn({
          message: `Transaction failed: Game not found`,
          gameId,
        });
        throw new NotFoundException(`Jogo com ID "${gameId}" não encontrado.`);
      }
      this.logger.info({
        message: `Game found: ${game.name}`,
        gameId: game._id,
        gameName: game.name,
      });

      const user = await this.usersService.findOne(userId);
      if (!user) {
        this.logger.warn({
          message: `Transaction failed: User not found`,
          userId,
        });
        throw new NotFoundException(
          `Usuário com ID "${userId}" não encontrado.`,
        );
      }
      this.logger.info({
        message: `User found: ${user.username}`,
        userId: user._id,
        username: user.username,
      });

      if (
        user.gamesBought &&
        user.gamesBought.some(
          (boughtGameId) => boughtGameId.toString() === gameId,
        )
      ) {
        this.logger.warn({
          message: `Transaction failed: User already owns game`,
          userId: user._id,
          gameId: game._id,
          gameName: game.name,
        });
        throw new ConflictException(
          `O jogo "${game.name}" já foi adicionado à biblioteca do usuário "${user.username}".`,
        );
      }

      const valorCalculado = game.price * (1 - (game.discount || 0) / 100);
      if (amount !== valorCalculado) {
        this.logger.warn({
          message: `Valor informado (${amount}) difere do calculado (${valorCalculado}).`,
          dtoAmount: amount,
          calculatedAmount: valorCalculado,
          gameName: game.name,
        });
      }

      const transacao = new this.transactionModel({
        game: game._id,
        user: user._id,
        transactionDate: new Date(),
        amount,
        discountApplied,
      });

      const salva = await transacao.save();

      await this.usersService.addGameToUserBoughtList(
        user._id as string,
        game._id as string,
      );

      this.logger.info({
        message: `Transação criada com sucesso.`,
        transactionId: salva._id,
        usuario: user.username,
        jogo: game.name,
        valor: amount,
      });

      return salva;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error({
          message: `Formato inválido para ID de jogo ou usuário.`,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          'Formato inválido para ID de jogo ou usuário.',
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error({
        message: 'Erro ao criar transação.',
        erro: error instanceof Error ? error.message : error,
      });
      throw new BadRequestException('Erro inesperado ao criar transação.');
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      this.logger.info({ message: 'Listando todas as transações.' });
      return await this.transactionModel
        .find()
        .populate('game')
        .populate('user')
        .exec();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          message: 'Erro ao listar transações.',
          error: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error({ message: 'Erro ao listar transações.', error });
      }
      throw new BadRequestException('Não foi possível listar as transações.');
    }
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    this.logger.info({
      message: `Listando transações do usuário ${userId}.`,
      userId,
    });
    try {
      const transactions = await this.transactionModel
        .find({ user: userId })
        .populate('game')
        .populate('user')
        .exec();
      if (!transactions) {
        this.logger.warn({
          message: `Nenhuma transação encontrada para o usuário ${userId}.`,
          userId,
        });
        return [];
      }
      return transactions;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error({
          message: `ID de usuário inválido para listar transações.`,
          userId,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${userId}" possui formato inválido.`,
        );
      }
      this.logger.error({
        message: 'Erro ao listar transações por usuário.',
        userId,
        erro: error instanceof Error ? error.message : error,
      });
      throw new BadRequestException(
        'Não foi possível listar as transações do usuário.',
      );
    }
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      this.logger.info({ message: `Buscando transação com ID "${id}".` });
      const transacao = await this.transactionModel
        .findById(id)
        .populate('game')
        .populate('user')
        .exec();
      if (!transacao) {
        this.logger.warn({
          message: `Transação com ID "${id}" não encontrada.`,
        });
        throw new NotFoundException(`Transação com ID "${id}" não encontrada.`);
      }
      return transacao;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      this.logger.error({
        message: 'Erro ao buscar transação.',
        erro: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }

  async remove(id: string): Promise<Transaction> {
    try {
      this.logger.info({ message: `Removendo transação com ID "${id}".` });
      const transacaoRemovida = await this.transactionModel
        .findByIdAndDelete(id)
        .exec();
      if (!transacaoRemovida) {
        this.logger.warn({
          message: `Transação com ID "${id}" não encontrada para remoção.`,
        });
        throw new NotFoundException(
          `Transação com ID "${id}" não encontrada para remoção.`,
        );
      }
      this.logger.info({
        message: `Transação com ID "${id}" removida com sucesso.`,
      });
      return transacaoRemovida;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      this.logger.error({
        message: 'Erro ao remover transação.',
        erro: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
