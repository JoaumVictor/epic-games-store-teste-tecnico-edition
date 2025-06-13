// backend/src/games/games.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { Game } from './schemas/game.schema';

@Controller('games') // Define o prefixo da rota para este controlador
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // Rota para criar um novo jogo
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto);
  }

  // Rota para buscar todos os jogos
  @Get()
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  // Rota para buscar um jogo específico pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Game> {
    return this.gamesService.findOne(id);
  }

  // Rota para atualizar um jogo pelo ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    return this.gamesService.update(id, updateGameDto);
  }

  // Rota para remover um jogo pelo ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna status 204 No Content para remoção bem-sucedida
  async remove(@Param('id') id: string): Promise<Game> {
    return this.gamesService.remove(id);
  }
}
