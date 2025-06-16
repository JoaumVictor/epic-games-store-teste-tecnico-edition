/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/transactions/transactions.service.ts
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

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const {
      game: gameId,
      user: userId,
      amount,
      discountApplied,
    } = createTransactionDto;

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

      const finalAmount = game.price * (1 - (game.discount || 0) / 100);
      if (amount !== finalAmount) {
        this.logger.warn({
          message: `Value mismatch for transaction. Using DTO amount.`,
          dtoAmount: amount,
          calculatedAmount: finalAmount,
          gameName: game.name,
        });
      }

      const createdTransaction = new this.transactionModel({
        game: game._id,
        user: user._id,
        transactionDate: new Date(),
        amount: amount,
        discountApplied: discountApplied,
      });

      const savedTransaction = await createdTransaction.save();
      this.logger.info({
        message: `Transaction saved`,
        transactionId: savedTransaction._id,
        userId: user._id,
        username: user.username,
        gameId: game._id,
        gameName: game.name,
      });

      await this.usersService.addGameToUserBoughtList(
        user._id as string,
        game._id as string,
      );
      this.logger.info({
        message: `Game added to user's bought list`,
        userId: user._id,
        username: user.username,
        gameId: game._id,
        gameName: game.name,
      });

      this.logger.info({
        message: `Transaction successful`,
        user: user.username,
        game: game.name,
        finalAmount: amount,
        transactionId: savedTransaction._id,
      });

      return savedTransaction;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error({
          message: `Transaction failed: Invalid ID format.`,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          'Um dos IDs (jogo ou usuário) possui formato inválido.',
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error({
          message: `Transaction failed: ${error.message}`,
          error: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error({
          message: `Transaction failed: Unknown error`,
          error,
        });
      }
      throw error;
    }
  }

  // Método para encontrar todas as transações, opcionalmente filtradas por userId
  async findAll(userId?: string): Promise<Transaction[]> {
    // <--- Recebe userId
    try {
      const query: any = {}; // Objeto para construir a query do Mongoose
      if (userId) {
        query.user = userId; // Adiciona o filtro por usuário se o userId for fornecido
        this.logger.info(`Fetching transactions for User ID: ${userId}.`); // <--- Log ajustado
      } else {
        this.logger.info('Fetching all transactions.'); // <--- Log para todas as transações
      }

      return await this.transactionModel
        .find(query) // <--- Usa o objeto de query
        .populate('game')
        .populate('user')
        .exec();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Error fetching all transactions.', {
          error: error.message,
          stack: error.stack,
          userId,
        }); // <--- Log ajustado
      } else {
        this.logger.error('Error fetching all transactions.', {
          error,
          userId,
        }); // <--- Log ajustado
      }
      throw new BadRequestException('Não foi possível listar as transações.');
    }
  }

  // ... (outros métodos do service, como findOne, remove)
  async findOne(id: string): Promise<Transaction> {
    try {
      this.logger.info({
        message: `Fetching transaction with ID: ${id}.`,
        transactionId: id,
      });
      const transaction = await this.transactionModel
        .findById(id)
        .populate('game')
        .populate('user')
        .exec();
      if (!transaction) {
        this.logger.warn({
          message: `Transaction with ID "${id}" not found.`,
          transactionId: id,
        });
        throw new NotFoundException(`Transação com ID "${id}" não encontrada.`);
      }
      return transaction;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error({
          message: `Invalid transaction ID format: ${id}.`,
          transactionId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      if (error instanceof Error) {
        this.logger.error({
          message: `Error fetching transaction with ID ${id}: ${error.message}`,
          transactionId: id,
          error: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error({
          message: `Error fetching transaction with ID ${id}: Unknown error`,
          transactionId: id,
          error,
        });
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Transaction> {
    try {
      this.logger.info({
        message: `Attempting to remove transaction with ID: ${id}.`,
        transactionId: id,
      });
      const deletedTransaction = await this.transactionModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedTransaction) {
        this.logger.warn({
          message: `Transaction with ID "${id}" not found for removal.`,
          transactionId: id,
        });
        throw new NotFoundException(
          `Transação com ID "${id}" não encontrada para remoção.`,
        );
      }
      this.logger.info({
        message: `Transaction with ID ${id} removed successfully.`,
        transactionId: id,
      });
      return deletedTransaction;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error({
          message: `Invalid transaction ID format for removal: ${id}.`,
          transactionId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      if (error instanceof Error) {
        this.logger.error({
          message: `Error removing transaction with ID ${id}: ${error.message}`,
          transactionId: id,
          error: error.message,
          stack: error.stack,
        });
      } else {
        this.logger.error({
          message: `Error removing transaction with ID ${id}: Unknown error`,
          transactionId: id,
          error,
        });
      }
      throw error;
    }
  }
}
