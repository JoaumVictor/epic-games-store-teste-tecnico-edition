import { IsMongoId, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID do jogo envolvido na transação',
    example: '60c72b2f9b1d8c001c8e4d21',
  })
  @IsMongoId()
  game: string;

  @ApiProperty({
    description: 'ID do usuário que realizou a transação',
    example: '60c72b2f9b1d8c001c8e4d22',
  })
  @IsMongoId()
  user: string;

  @ApiProperty({ description: 'Valor final pago na transação', example: 49.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Percentual de desconto aplicado (0-100)',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountApplied?: number;
}
