// backend/src/games/games.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './schemas/game.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // Rota para buscar todos os jogos
  @Get()
  @ApiOperation({ summary: 'Retorna todos os jogos disponíveis' }) // Descrição da operação no Swagger
  @ApiResponse({
    status: 200,
    description: 'Lista de jogos retornada com sucesso.',
    type: [Game],
  }) // Documenta a resposta
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  // Rota para buscar um jogo específico pelo ID
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um jogo específico pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do jogo',
    example: '60c72b2f9b1d8c001c8e4d21',
  }) // Documenta o parâmetro de rota
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
}
