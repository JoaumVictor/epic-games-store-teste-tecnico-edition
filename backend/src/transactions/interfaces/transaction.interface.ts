// backend/src/transactions/interfaces/transaction.interface.ts
import { Document } from 'mongoose';
import { Game } from '../../games/schemas/game.schema'; // Importa a interface do jogo
import { User } from '../../users/schemas/user.schema'; // Importa a interface do usuário

export interface Transaction extends Document {
  readonly game: Game | string; // Referência ao ID do jogo ou o objeto populado
  readonly user: User | string; // Referência ao ID do usuário ou o objeto populado
  readonly transactionDate: Date; // Data e hora da transação
  readonly amount: number; // Valor final pago pela transação
  readonly discountApplied?: number; // Desconto aplicado em porcentagem (opcional)
}
