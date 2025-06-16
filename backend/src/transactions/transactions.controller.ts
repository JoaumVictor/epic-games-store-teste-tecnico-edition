// backend/src/transactions/transactions.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common'; // Importa Query
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'; // Importa ApiQuery

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Rota para criar uma nova transação
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  // @UseGuards(JwtAuthGuard)
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  // Rota para buscar todas as transações, opcionalmente filtradas por ID de usuário
  @Get()
  @ApiOperation({
    summary:
      'Retorna todas as transações registradas, opcionalmente filtradas por ID de usuário.',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID do usuário para filtrar as transações.',
    example: '60c72b2f9b1d8c001c8e4d22',
  }) // <--- Documenta o parâmetro
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso.',
    type: [Transaction],
  })
  async findAll(@Query('userId') userId?: string): Promise<Transaction[]> {
    // <--- Recebe userId como query param
    return this.transactionsService.findAll(userId); // <--- Passa o userId para o service
  }

  // ... (outros métodos do controller, se houver)
}
