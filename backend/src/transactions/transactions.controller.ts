import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova transação de compra de jogo.' })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Jogo ou usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já possui o jogo.' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todas as transações (sem filtro de usuário no path).',
  })
  @ApiResponse({
    status: 200,
    description: 'Transações encontradas com sucesso.',
    type: [Transaction],
  })
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Lista todas as transações de um usuário específico.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário para filtrar transações.',
    example: '60c72b2f9b1d8c001c8e4d22',
  })
  @ApiResponse({
    status: 200,
    description: 'Transações do usuário encontradas com sucesso.',
    type: [Transaction],
  })
  @ApiResponse({ status: 400, description: 'ID de usuário inválido.' })
  async findByUserId(@Param('userId') userId: string): Promise<Transaction[]> {
    return this.transactionsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma transação pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada.',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma transação pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação removida com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada.' })
  async remove(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.remove(id);
  }
}
