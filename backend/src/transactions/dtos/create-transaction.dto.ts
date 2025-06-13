// backend/src/transactions/dtos/create-transaction.dto.ts
import { IsMongoId, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId() // Valida se é um ID válido do MongoDB
  game: string; // ID do jogo

  @IsMongoId() // Valida se é um ID válido do MongoDB
  user: string; // ID do usuário

  @IsNumber()
  @Min(0)
  amount: number; // Valor final da transação

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountApplied?: number; // Desconto aplicado
}
