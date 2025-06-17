import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Game } from '../../games/schemas/game.schema';
import { User } from '../../users/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @ApiProperty({
    description: 'ID do jogo associado à transação',
    example: '60c72b2f9b1d8c001c8e4d21',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true })
  game: Game;

  @ApiProperty({
    description: 'ID do usuário que realizou a transação',
    example: '60c72b2f9b1d8c001c8e4d22',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({
    description: 'Data e hora da transação',
    example: '2025-06-17T10:30:00.000Z',
  })
  @Prop({ required: true, default: Date.now })
  transactionDate: Date;

  @ApiProperty({ description: 'Valor final pago na transação', example: 49.99 })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({
    description: 'Percentual de desconto aplicado (0-100)',
    required: false,
    example: 10,
  })
  @Prop({ min: 0, max: 100, default: 0 })
  discountApplied?: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
