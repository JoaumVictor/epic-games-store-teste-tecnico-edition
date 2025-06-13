// backend/src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { GamesModule } from '../games/games.module'; // Importa GamesModule para poder usar GamesService
import { UsersModule } from '../users/users.module'; // Importa UsersModule para poder usar UsersService

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    GamesModule, // Importa para poder acessar o GameService se necessário
    UsersModule, // Importa para poder acessar o UserService se necessário
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
