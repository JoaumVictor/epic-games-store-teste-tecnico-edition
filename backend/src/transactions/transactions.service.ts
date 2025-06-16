// backend/src/transactions/transactions.service.ts
import {
  Injectable,
  BadRequestException, // Para IDs inválidos ou referências não encontradas
  NotFoundException, // Para referências não encontradas
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose'; // Importa Error do Mongoose
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GamesService } from '../games/games.service'; // <--- Importa o GamesService
import { UsersService } from '../users/users.service'; // <--- Importa o UsersService

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly gamesService: GamesService, // <--- Injeta GamesService
    private readonly usersService: UsersService, // <--- Injeta UsersService
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    try {
      // --- Validação de Referências ---
      // 1. Verificar se o jogo existe
      const game = await this.gamesService.findOne(createTransactionDto.game);
      if (!game) {
        throw new NotFoundException(
          `Jogo com ID "${createTransactionDto.game}" não encontrado.`,
        );
      }

      // 2. Verificar se o usuário existe
      const user = await this.usersService.findOne(createTransactionDto.user);
      if (!user) {
        throw new NotFoundException(
          `Usuário com ID "${createTransactionDto.user}" não encontrado.`,
        );
      }

      // Calcula o valor final com desconto
      const finalAmount = game.price * (1 - (game.discount || 0) / 100);
      if (createTransactionDto.amount !== finalAmount) {
        // Opcional: Se você quiser que o front envie o valor exato calculado, pode validar aqui
        // Ou, se o front enviar um valor, você pode confiar nele ou recalcular e sobrescrever.
        // Por segurança, é bom recalcular e usar o valor do backend.
        // throw new BadRequestException('O valor da transação não corresponde ao preço do jogo com desconto.');
        console.warn(
          `Valor da transação (${createTransactionDto.amount}) difere do calculado (${finalAmount}) para o jogo ${game.name}. Usando valor do DTO.`,
        );
      }

      const createdTransaction = new this.transactionModel({
        game: game._id, // Garante que a referência é para o ID do objeto real
        user: user._id, // Garante que a referência é para o ID do objeto real
        transactionDate: new Date(), // Garante a data/hora exata da transação
        amount: createTransactionDto.amount, // Usa o valor enviado pelo DTO (ou finalAmount se preferir)
        discountApplied: createTransactionDto.discountApplied, // Usa o desconto enviado
      });
      return await createdTransaction.save();
    } catch (error) {
      // Se a GamesService ou UsersService lançarem NotFoundException, ela será propagada.
      // Aqui tratamos erros específicos desta camada ou erros gerais de Mongoose.
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          'Um dos IDs (jogo ou usuário) possui formato inválido.',
        );
      }
      // Re-lança NotFoundExceptions vindas dos serviços injetados ou outros erros
      throw error;
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      // Populate permite "juntar" os dados referenciados (game e user)
      return await this.transactionModel
        .find()
        .populate('game') // Popula os detalhes do jogo
        .populate('user') // Popula os detalhes do usuário
        .exec();
    } catch (error) {
      console.error('Erro ao buscar todas as transações:', error);
      throw new BadRequestException('Não foi possível listar as transações.');
    }
  }

  // --- Adicione findOne, update, remove para transações se necessário ---
  // Exemplo de findOne
  async findOne(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionModel
        .findById(id)
        .populate('game')
        .populate('user')
        .exec();
      if (!transaction) {
        throw new NotFoundException(`Transação com ID "${id}" não encontrada.`);
      }
      return transaction;
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      throw error;
    }
  }

  // Exemplo de remove
  async remove(id: string): Promise<Transaction> {
    try {
      const deletedTransaction = await this.transactionModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedTransaction) {
        throw new NotFoundException(
          `Transação com ID "${id}" não encontrada para remoção.`,
        );
      }
      return deletedTransaction;
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      throw error;
    }
  }
}
