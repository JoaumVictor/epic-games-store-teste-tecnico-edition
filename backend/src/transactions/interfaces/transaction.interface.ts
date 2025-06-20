import { Document } from 'mongoose';
import { Game } from '../../games/schemas/game.schema';
import { User } from '../../users/schemas/user.schema';

export interface Transaction extends Document {
  readonly game: Game | string;
  readonly user: User | string;
  readonly transactionDate: Date;
  readonly amount: number;
  readonly discountApplied?: number;
}
