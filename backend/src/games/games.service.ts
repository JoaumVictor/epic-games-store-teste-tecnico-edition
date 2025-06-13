// backend/src/games/games.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';

@Injectable()
export class GamesService {
  // Injeta o modelo Game do Mongoose
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  // Cria um novo jogo
  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  // Encontra todos os jogos
  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  // Encontra um jogo pelo ID
  async findOne(id: string): Promise<Game> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
    }
    return game;
  }

  // Atualiza um jogo pelo ID
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const existingGame = await this.gameModel
      .findByIdAndUpdate(id, { $set: updateGameDto }, { new: true }) // $set para atualizar apenas os campos fornecidos, new: true retorna o doc atualizado
      .exec();
    if (!existingGame) {
      throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
    }
    return existingGame;
  }

  // Remove um jogo pelo ID
  async remove(id: string): Promise<Game> {
    const deletedGame = await this.gameModel.findByIdAndDelete(id).exec();
    if (!deletedGame) {
      throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
    }
    return deletedGame;
  }
}
