// backend/src/transactions/transactions.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Rota para criar uma nova transação
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
  @ApiOperation({ summary: 'Cria uma nova transação de compra de jogo' })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
    type: Transaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos (IDs com formato errado, etc.).',
  })
  @ApiResponse({ status: 404, description: 'Jogo ou usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já possui o jogo.' })
  // @UseGuards(JwtAuthGuard) // Se estiver usando JWT para proteger
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  // Rota para buscar todas as transações
  @Get()
  @ApiOperation({ summary: 'Retorna todas as transações registradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso.',
    type: [Transaction],
  })
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }
}
