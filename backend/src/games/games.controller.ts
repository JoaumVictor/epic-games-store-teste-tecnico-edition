import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os jogos disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de jogos retornada com sucesso.',
    type: [Game],
  })
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um jogo específico pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do jogo',
    example: '60c72b2f9b1d8c001c8e4d21',
  })
  @ApiResponse({
    status: 200,
    description: 'Jogo encontrado com sucesso.',
    type: Game,
  })
  @ApiResponse({ status: 404, description: 'Jogo não encontrado.' })
  @ApiResponse({ status: 400, description: 'ID de jogo inválido.' })
  async findOne(@Param('id') id: string): Promise<Game> {
    return this.gamesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo jogo' })
  @ApiBody({ type: CreateGameDto })
  @ApiResponse({
    status: 201,
    description: 'Jogo criado com sucesso.',
    type: Game,
  })
  @ApiResponse({ status: 409, description: 'Já existe um jogo com este nome.' })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um jogo existente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do jogo a ser atualizado' })
  @ApiBody({ type: UpdateGameDto })
  @ApiResponse({
    status: 200,
    description: 'Jogo atualizado com sucesso.',
    type: Game,
  })
  @ApiResponse({
    status: 404,
    description: 'Jogo não encontrado para atualização.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido ou dados inválidos para atualização.',
  })
  @ApiResponse({
    status: 409,
    description: 'Nome do jogo já está em uso por outro jogo.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um jogo existente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do jogo a ser removido' })
  @ApiResponse({ status: 204, description: 'Jogo removido com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Jogo não encontrado para remoção.',
  })
  @ApiResponse({ status: 400, description: 'ID inválido para remoção.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.gamesService.remove(id);
  }
}
