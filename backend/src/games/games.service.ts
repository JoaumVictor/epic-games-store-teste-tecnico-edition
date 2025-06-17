/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    this.logger.info(`Tentando criar jogo: ${createGameDto.name}`, {
      nomeDoJogo: createGameDto.name,
      desenvolvedor: createGameDto.developer,
    });
    try {
      const createdGame = new this.gameModel(createGameDto);
      const savedGame = await createdGame.save();
      this.logger.info(`Jogo criado com sucesso: ${savedGame.name}`, {
        idDoJogo: savedGame._id,
        nomeDoJogo: savedGame.name,
      });
      return savedGame;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 11000
      ) {
        this.logger.warn(`Falha ao criar jogo: nome já existente`, {
          nomeDoJogo: createGameDto.name,
          erro: error.message,
        });
        throw new ConflictException('Já existe um jogo com este nome.');
      }
      this.logger.error(`Erro desconhecido ao criar jogo`, {
        nomeDoJogo: createGameDto.name,
        erro: error,
      });
      throw error;
    }
  }

  async findAll(): Promise<Game[]> {
    this.logger.info('Buscando todos os jogos.');
    try {
      return await this.gameModel.find().exec();
    } catch (error: unknown) {
      this.logger.error('Erro ao buscar todos os jogos.', { erro: error });
      throw new BadRequestException('Não foi possível listar os jogos.');
    }
  }

  async findOne(id: string): Promise<Game> {
    this.logger.info(`Buscando jogo com ID: ${id}`, { idDoJogo: id });
    try {
      const game = await this.gameModel.findById(id).exec();
      if (!game) {
        this.logger.warn(`Jogo com ID "${id}" não encontrado.`, {
          idDoJogo: id,
        });
        throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
      }
      this.logger.info(`Jogo encontrado: ${game.name}`, {
        idDoJogo: game._id,
        nomeDoJogo: game.name,
      });
      return game;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Formato inválido de ID: ${id}`, {
          idDoJogo: id,
          erro: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      this.logger.error(`Erro ao buscar jogo com ID ${id}`, {
        idDoJogo: id,
        erro: error,
      });
      throw error;
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    this.logger.info(`Tentando atualizar jogo com ID: ${id}`, {
      idDoJogo: id,
      dadosAtualizados: updateGameDto,
    });
    try {
      const existingGame = await this.gameModel
        .findByIdAndUpdate(id, { $set: updateGameDto }, { new: true })
        .exec();
      if (!existingGame) {
        this.logger.warn(
          `Jogo com ID "${id}" não encontrado para atualização.`,
          {
            idDoJogo: id,
          },
        );
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para atualização.`,
        );
      }
      this.logger.info(`Jogo atualizado com sucesso: ${existingGame.name}`, {
        idDoJogo: existingGame._id,
        nomeDoJogo: existingGame.name,
      });
      return existingGame;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Formato inválido de ID para atualização: ${id}`, {
          idDoJogo: id,
          erro: error.message,
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
        this.logger.warn(`Falha na atualização: nome de jogo já em uso.`, {
          idDoJogo: id,
          nomeDoJogo: updateGameDto.name,
          erro: error.message,
        });
        throw new ConflictException(
          'Já existe outro jogo com o nome informado.',
        );
      }
      this.logger.error(`Erro desconhecido ao atualizar jogo.`, {
        idDoJogo: id,
        erro: error,
      });
      throw error;
    }
  }

  async remove(id: string): Promise<Game> {
    this.logger.info(`Tentando remover jogo com ID: ${id}`, {
      idDoJogo: id,
    });
    try {
      const deletedGame = await this.gameModel.findByIdAndDelete(id).exec();
      if (!deletedGame) {
        this.logger.warn(`Jogo com ID "${id}" não encontrado para remoção.`, {
          idDoJogo: id,
        });
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para remoção.`,
        );
      }
      this.logger.info(`Jogo removido com sucesso: ${id}`, {
        idDoJogo: id,
        nomeDoJogo: deletedGame.name,
      });
      return deletedGame;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Formato inválido de ID para remoção: ${id}`, {
          idDoJogo: id,
          erro: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      this.logger.error(`Erro ao remover jogo com ID ${id}`, {
        idDoJogo: id,
        erro: error,
      });
      throw error;
    }
  }
}
