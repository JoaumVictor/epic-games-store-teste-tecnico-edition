// backend/src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dtos/create-transaction.dto'; // Você precisaria criar este DTO
// import { GamesService } from '../games/games.service'; // Se precisar interagir com jogos
// import { UsersService } from '../users/users.service';   // Se precisar interagir com usuários

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    // private readonly gamesService: GamesService, // Exemplo de injeção de outro serviço
    // private readonly usersService: UsersService, // Exemplo de injeção de outro serviço
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Em uma transação real, você buscaria o jogo e o usuário
    // const game = await this.gamesService.findOne(createTransactionDto.gameId);
    // const user = await this.usersService.findOne(createTransactionDto.userId);

    const createdTransaction = new this.transactionModel({
      ...createTransactionDto,
      // game: game._id, // Usaria o ID do objeto real
      // user: user._id, // Usaria o ID do objeto real
    });
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    // Populate permite "juntar" os dados referenciados (game e user)
    return this.transactionModel
      .find()
      .populate('game')
      .populate('user')
      .exec();
  }

  // ... outros métodos CRUD para transações
}
