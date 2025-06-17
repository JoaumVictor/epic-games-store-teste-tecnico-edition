/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

    this.logger.info(`Tentando criar transação.`, { gameId, userId, amount });

    try {
      const game = await this.gamesService.findOne(gameId);
      if (!game) {
        this.logger.warn(`Jogo com ID "${gameId}" não encontrado.`);
        throw new NotFoundException(`Jogo com ID "${gameId}" não encontrado.`);
      }

      const user = await this.usersService.findOne(userId);
      if (!user) {
        this.logger.warn(`Usuário com ID "${userId}" não encontrado.`);
        throw new NotFoundException(
          `Usuário com ID "${userId}" não encontrado.`,
        );
      }

      if (user.gamesBought?.some((id) => id.toString() === gameId)) {
        this.logger.warn(
          `Usuário "${user.username}" já possui o jogo "${game.name}".`,
        );
        throw new ConflictException(
          `Usuário "${user.username}" já possui o jogo "${game.name}".`,
        );
      }

      const valorCalculado = game.price * (1 - (game.discount || 0) / 100);
      if (amount !== valorCalculado) {
        this.logger.warn(
          `Valor informado (${amount}) difere do calculado (${valorCalculado}).`,
        );
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

      this.logger.info(`Transação criada com sucesso.`, {
        transacaoId: salva._id,
        usuario: user.username,
        jogo: game.name,
        valor: amount,
      });

      return salva;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
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
      this.logger.error('Erro ao criar transação.', {
        erro: error instanceof Error ? error.message : error,
      });
      throw new BadRequestException('Erro inesperado ao criar transação.');
    }
  }

  async findAll(userId?: string): Promise<Transaction[]> {
    try {
      const query: any = {};
      if (userId) {
        query.user = userId;
        this.logger.info(`Listando transações do usuário ${userId}.`);
      } else {
        this.logger.info('Listando todas as transações.');
      }

      return await this.transactionModel
        .find(query)
        .populate('game')
        .populate('user')
        .exec();
    } catch (error: unknown) {
      this.logger.error('Erro ao listar transações.', {
        erro: error instanceof Error ? error.message : error,
        userId,
      });
      throw new BadRequestException('Não foi possível listar as transações.');
    }
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      this.logger.info(`Buscando transação com ID "${id}".`);
      const transacao = await this.transactionModel
        .findById(id)
        .populate('game')
        .populate('user')
        .exec();
      if (!transacao) {
        this.logger.warn(`Transação com ID "${id}" não encontrada.`);
        throw new NotFoundException(`Transação com ID "${id}" não encontrada.`);
      }
      return transacao;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      this.logger.error('Erro ao buscar transação.', {
        erro: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }

  async remove(id: string): Promise<Transaction> {
    try {
      this.logger.info(`Removendo transação com ID "${id}".`);
      const transacaoRemovida = await this.transactionModel
        .findByIdAndDelete(id)
        .exec();
      if (!transacaoRemovida) {
        this.logger.warn(
          `Transação com ID "${id}" não encontrada para remoção.`,
        );
        throw new NotFoundException(
          `Transação com ID "${id}" não encontrada para remoção.`,
        );
      }
      this.logger.info(`Transação com ID "${id}" removida com sucesso.`);
      return transacaoRemovida;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      this.logger.error('Erro ao remover transação.', {
        erro: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
