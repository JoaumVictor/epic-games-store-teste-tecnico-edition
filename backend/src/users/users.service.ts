/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject, // <--- Importa Inject
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto'; // Importa CreateUserDto
import { UpdateUserDto } from './dtos/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // <--- Importa WINSTON_MODULE_PROVIDER
import { Logger } from 'winston'; // <--- Importa Logger do winston

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // <--- Injeta o Logger
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info(`Attempting to create user: ${createUserDto.email}`, {
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
      this.logger.info(`User created successfully: ${savedUser.email}`, {
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
          this.logger.warn(`User creation failed: Email already exists`, {
            email: createUserDto.email,
            error: error.message,
          });
          throw new ConflictException('Já existe um usuário com este e-mail.');
        }
        if (error.message.includes('username')) {
          this.logger.warn(`User creation failed: Username already exists`, {
            username: createUserDto.username,
            error: error.message,
          });
          throw new ConflictException(
            'Já existe um usuário com este nome de usuário.',
          );
        }
        this.logger.error(`User creation failed: Data conflict`, { error });
        throw new ConflictException('Conflito de dados ao criar usuário.');
      }
      this.logger.error(`User creation failed: Unknown error`, { error });
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.info('Fetching all users.');
    try {
      return await this.userModel
        .find()
        .select('-password -gamesBought -__v')
        .exec();
    } catch (error: unknown) {
      this.logger.error('Error fetching all users.', { error });
      throw new BadRequestException('Não foi possível listar os usuários.');
    }
  }

  async findOne(id: string): Promise<User> {
    this.logger.info(`Fetching user with ID: ${id}.`, { userId: id });
    try {
      const user = await this.userModel
        .findById(id)
        .select('-password -__v')
        .exec();
      if (!user) {
        this.logger.warn(`User with ID "${id}" not found.`, { userId: id });
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      this.logger.info(`User found: ${user.email}`, {
        userId: user._id,
        email: user.email,
      });
      return user;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid user ID format: ${id}.`, {
          userId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      this.logger.error(`Error fetching user with ID ${id}.`, { error });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info(`Fetching user by email: ${email}.`);
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error: unknown) {
      this.logger.error(`Error fetching user by email: ${email}.`, { error });
      throw new BadRequestException(
        'Não foi possível buscar o usuário por email.',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.info(`Attempting to update user with ID: ${id}.`, {
      userId: id,
      updateData: updateUserDto,
    });
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const existingUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
        .select('-password -__v')
        .exec();
      if (!existingUser) {
        this.logger.warn(`User with ID "${id}" not found for update.`, {
          userId: id,
        });
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para atualização.`,
        );
      }
      this.logger.info(`User updated successfully: ${existingUser.email}`, {
        userId: existingUser._id,
      });
      return existingUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid user ID format for update: ${id}.`, {
          userId: id,
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
        if (error.message.includes('email')) {
          this.logger.warn(`User update failed: Email already in use.`, {
            userId: id,
            email: updateUserDto.email,
            error: error.message,
          });
          throw new ConflictException(
            'Este e-mail já está em uso por outro usuário.',
          );
        }
        if (error.message.includes('username')) {
          this.logger.warn(`User update failed: Username already in use.`, {
            userId: id,
            username: updateUserDto.username,
            error: error.message,
          });
          throw new ConflictException(
            'Este nome de usuário já está em uso por outro usuário.',
          );
        }
        this.logger.error(`User update failed: Data conflict.`, {
          userId: id,
          error,
        });
        throw new ConflictException('Conflito de dados ao atualizar usuário.');
      }
      this.logger.error(`User update failed: Unknown error.`, {
        userId: id,
        error,
      });
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    this.logger.info(`Attempting to remove user with ID: ${id}.`, {
      userId: id,
    });
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        this.logger.warn(`User with ID "${id}" not found for removal.`, {
          userId: id,
        });
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para remoção.`,
        );
      }
      this.logger.info(`User removed successfully: ${id}.`, {
        userId: id,
        email: deletedUser.email,
      });
      return deletedUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        this.logger.error(`Invalid user ID format for removal: ${id}.`, {
          userId: id,
          error: error.message,
          stack: (error as Error).stack,
        });
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      this.logger.error(`Error removing user with ID ${id}.`, {
        userId: id,
        error,
      });
      throw error;
    }
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    this.logger.debug('Comparing password hashes.'); // Usando debug para algo mais granular
    return bcrypt.compare(plainPassword, hashedPassword);
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
}
