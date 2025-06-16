/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/games/games.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject, // <--- Importa Inject
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto'; // Importa UpdateGameDto
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // <--- Importa WINSTON_MODULE_PROVIDER
import { Logger } from 'winston'; // <--- Importa Logger do winston

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // <--- Injeta o Logger
  ) {}

  // Cria um novo jogo
  async create(createGameDto: CreateGameDto): Promise<Game> {
    this.logger.info(`Attempting to create game: ${createGameDto.name}`, {
      gameName: createGameDto.name,
      developer: createGameDto.developer,
    });
    try {
      const createdGame = new this.gameModel(createGameDto);
      const savedGame = await createdGame.save();
      this.logger.info(`Game created successfully: ${savedGame.name}`, {
        gameId: savedGame._id,
        gameName: savedGame.name,
      });
      return savedGame;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 11000
      ) {
        this.logger.warn(`Game creation failed: Game name already exists`, {
          gameName: createGameDto.name,
          error: error.message,
        });
        throw new ConflictException('Já existe um jogo com este nome.');
      }
      this.logger.error(`Game creation failed: Unknown error`, {
        gameName: createGameDto.name,
        error,
      });
      throw error;
    }
  }

  // Encontra todos os jogos
  async findAll(): Promise<Game[]> {
    this.logger.info('Fetching all games.');
    try {
      return await this.gameModel.find().exec();
    } catch (error: unknown) {
      this.logger.error('Error fetching all games.', { error });
      throw new BadRequestException('Não foi possível listar os jogos.');
    }
  }

  // Encontra um jogo pelo ID
  async findOne(id: string): Promise<Game> {
    this.logger.info(`Fetching game with ID: ${id}.`, { gameId: id });
    try {
      const game = await this.gameModel.findById(id).exec();
      if (!game) {
        this.logger.warn(`Game with ID "${id}" not found.`, { gameId: id });
        throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
      }
      this.logger.info(`Game found: ${game.name}`, {
        gameId: game._id,
        gameName: game.name,
      });
      return game;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid game ID format: ${id}.`, {
          gameId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      this.logger.error(`Error fetching game with ID ${id}.`, {
        gameId: id,
        error,
      });
      throw error;
    }
  }

  // Atualiza um jogo pelo ID
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    this.logger.info(`Attempting to update game with ID: ${id}.`, {
      gameId: id,
      updateData: updateGameDto,
    });
    try {
      const existingGame = await this.gameModel
        .findByIdAndUpdate(id, { $set: updateGameDto }, { new: true })
        .exec();
      if (!existingGame) {
        this.logger.warn(`Game with ID "${id}" not found for update.`, {
          gameId: id,
        });
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para atualização.`,
        );
      }
      this.logger.info(`Game updated successfully: ${existingGame.name}`, {
        gameId: existingGame._id,
        gameName: existingGame.name,
      });
      return existingGame;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid game ID format for update: ${id}.`, {
          gameId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para atualização.`,
        );
      }
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 11000
      ) {
        this.logger.warn(`Game update failed: Game name already in use.`, {
          gameId: id,
          gameName: updateGameDto.name,
          error: error.message,
        });
        throw new ConflictException(
          'Já existe outro jogo com o nome informado.',
        );
      }
      this.logger.error(`Game update failed: Unknown error.`, {
        gameId: id,
        error,
      });
      throw error;
    }
  }

  // Remove um jogo pelo ID
  async remove(id: string): Promise<Game> {
    this.logger.info(`Attempting to remove game with ID: ${id}.`, {
      gameId: id,
    });
    try {
      const deletedGame = await this.gameModel.findByIdAndDelete(id).exec();
      if (!deletedGame) {
        this.logger.warn(`Game with ID "${id}" not found for removal.`, {
          gameId: id,
        });
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para remoção.`,
        );
      }
      this.logger.info(`Game removed successfully: ${id}.`, {
        gameId: id,
        gameName: deletedGame.name,
      });
      return deletedGame;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid game ID format for removal: ${id}.`, {
          gameId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      this.logger.error(`Error removing game with ID ${id}.`, {
        gameId: id,
        error,
      });
      throw error;
    }
  }
}
