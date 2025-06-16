/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/games/games.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException, // Para erros de duplicidade
  BadRequestException, // Para IDs inválidos
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose'; // Importa Error do Mongoose para tipagem
import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dtos/create-game.dto';
import { UpdateGameDto } from './dtos/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  // Cria um novo jogo
  async create(createGameDto: CreateGameDto): Promise<Game> {
    try {
      const createdGame = new this.gameModel(createGameDto);
      return await createdGame.save();
    } catch (error) {
      // Verifica se é um erro de duplicidade de chave (código 11000 do MongoDB)
      // Usamos 'in' para verificar a existência da propriedade 'code' de forma segura
      // e depois 'as any' para acessar a propriedade 'code' que pode não estar diretamente no tipo Error
      if ('code' in error && error.code === 11000) {
        throw new ConflictException('Já existe um jogo com este nome.');
      }
      // Re-lança outros erros para serem tratados globalmente ou logados
      throw error;
    }
  }

  // Encontra todos os jogos
  async findAll(): Promise<Game[]> {
    try {
      return await this.gameModel.find().exec();
    } catch (error) {
      // Em casos de findAll, erros são mais raros, mas podem indicar problemas de conexão
      console.error('Erro ao buscar todos os jogos:', error);
      // Lança um erro mais genérico ou específico de conexão se for o caso
      throw new BadRequestException('Não foi possível listar os jogos.');
    }
  }

  // Encontra um jogo pelo ID
  async findOne(id: string): Promise<Game> {
    try {
      const game = await this.gameModel.findById(id).exec();
      if (!game) {
        throw new NotFoundException(`Jogo com ID "${id}" não encontrado.`);
      }
      return game;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      // Re-lança outros erros
      throw error;
    }
  }

  // Atualiza um jogo pelo ID
  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    try {
      const existingGame = await this.gameModel
        .findByIdAndUpdate(id, { $set: updateGameDto }, { new: true })
        .exec();
      if (!existingGame) {
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para atualização.`,
        );
      }
      return existingGame;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para atualização.`,
        );
      }
      // Verifica se é um erro de duplicidade de chave ao tentar atualizar um nome
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any)?.code === 11000
      ) {
        throw new ConflictException(
          'Já existe outro jogo com o nome informado.',
        );
      }
      // Re-lança outros erros
      throw error;
    }
  }

  // Remove um jogo pelo ID
  async remove(id: string): Promise<Game> {
    try {
      const deletedGame = await this.gameModel.findByIdAndDelete(id).exec();
      if (!deletedGame) {
        throw new NotFoundException(
          `Jogo com ID "${id}" não encontrado para remoção.`,
        );
      }
      return deletedGame;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      // Re-lança outros erros
      throw error;
    }
  }
}
