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
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info(`Tentando criar usuário: ${createUserDto.email}`, {
      username: createUserDto.username,
      email: createUserDto.email,
    });

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createdUser = new this.userModel({
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
      });

      const savedUser = await createdUser.save();

      this.logger.info(`Usuário criado com sucesso: ${savedUser.email}`, {
        userId: savedUser._id,
        username: savedUser.username,
      });

      return savedUser.toObject({
        getters: true,
        virtuals: false,
        transform: (doc, ret) => {
          delete ret.password;
          delete ret.__v;
          return ret;
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 11000
      ) {
        if (error.message.includes('email')) {
          this.logger.warn('Falha ao criar usuário: email já cadastrado', {
            email: createUserDto.email,
            error: error.message,
          });
          throw new ConflictException('Este e-mail já está em uso.');
        }

        if (error.message.includes('username')) {
          this.logger.warn('Falha ao criar usuário: username já cadastrado', {
            username: createUserDto.username,
            error: error.message,
          });
          throw new ConflictException('Este nome de usuário já está em uso.');
        }

        this.logger.error('Erro de conflito ao criar usuário', { error });
        throw new ConflictException('Erro ao criar o usuário.');
      }

      this.logger.error('Erro desconhecido ao criar usuário', { error });
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.info('Buscando todos os usuários');
    try {
      return await this.userModel
        .find()
        .select('-password -gamesBought -__v')
        .exec();
    } catch (error: unknown) {
      this.logger.error('Erro ao buscar usuários', { error });
      throw new BadRequestException('Não foi possível listar os usuários.');
    }
  }

  async findOne(id: string): Promise<User> {
    this.logger.info(`Buscando usuário com ID: ${id}`, { userId: id });
    try {
      const user = await this.userModel
        .findById(id)
        .select('-password -__v')
        .exec();

      if (!user) {
        this.logger.warn(`Usuário com ID "${id}" não encontrado`, {
          userId: id,
        });
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`ID inválido: ${id}`, {
          userId: id,
          error: error.message,
        });
        throw new BadRequestException(`ID "${id}" é inválido.`);
      }

      this.logger.error('Erro ao buscar usuário', { error });
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.info(`Atualizando usuário com ID: ${id}`, {
      userId: id,
      updateData: updateUserDto,
    });

    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
        .select('-password -__v')
        .exec();

      if (!updatedUser) {
        this.logger.warn(
          `Usuário com ID "${id}" não encontrado para atualização`,
          {
            userId: id,
          },
        );
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`ID inválido: ${id}`, {
          userId: id,
          error: error.message,
        });
        throw new BadRequestException(`ID "${id}" é inválido.`);
      }

      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 11000
      ) {
        if (error.message.includes('email')) {
          throw new ConflictException('Este e-mail já está em uso.');
        }

        if (error.message.includes('username')) {
          throw new ConflictException('Este nome de usuário já está em uso.');
        }

        throw new ConflictException('Conflito de dados ao atualizar usuário.');
      }

      this.logger.error('Erro ao atualizar usuário', {
        userId: id,
        error,
      });
      throw error;
    }
  }

  async addGameToUserBoughtList(userId: string, gameId: string): Promise<User> {
    this.logger.info(
      `Attempting to add game ${gameId} to user ${userId}'s bought list.`,
    );
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { gamesBought: gameId } },
          { new: true, select: '-password -__v' },
        )
        .exec();

      if (!updatedUser) {
        this.logger.warn(
          `User with ID "${userId}" not found when trying to add game.`,
        );
        throw new NotFoundException(
          `Usuário com ID "${userId}" não encontrado para adicionar jogo.`,
        );
      }
      this.logger.info(
        `Game ${gameId} added to user ${userId}'s bought list successfully.`,
        { userId, gameId, updatedGamesBought: updatedUser.gamesBought },
      );
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(
          `Invalid user or game ID format when adding game to bought list.`,
          {
            userId,
            gameId,
            error: error.message,
            stack: (error as Error).stack,
          },
        );
        throw new BadRequestException(
          `ID do usuário ou do jogo possui formato inválido.`,
        );
      }
      this.logger.error(
        `Error adding game ${gameId} to user ${userId}'s bought list.`,
        { userId, gameId, error },
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.info(`Removendo usuário com ID: ${id}`, { userId: id });

    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        this.logger.warn(`Usuário com ID "${id}" não encontrado para remoção`, {
          userId: id,
        });
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }

      this.logger.info(`Usuário removido: ${deletedUser.email}`, {
        userId: deletedUser._id,
      });
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`ID inválido: ${id}`, {
          userId: id,
          error: error.message,
        });
        throw new BadRequestException(`ID "${id}" é inválido.`);
      }

      this.logger.error(`Erro ao remover usuário com ID ${id}`, {
        userId: id,
        error,
      });
      throw error;
    }
  }
}
