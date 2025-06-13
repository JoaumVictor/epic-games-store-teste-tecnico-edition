// backend/src/transactions/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Game } from '../../games/schemas/game.schema'; // Importa o Schema do Jogo
import { User } from '../../users/schemas/user.schema'; // Importa o Schema do Usuário

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true })
  game: Game; // Referência ao objeto Game

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User; // Referência ao objeto User

  @Prop({ required: true, default: Date.now })
  transactionDate: Date;

  @Prop({ required: true, min: 0 })
  amount: number; // Valor final da transação

  @Prop({ min: 0, max: 100, default: 0 })
  discountApplied?: number; // Desconto aplicado
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
