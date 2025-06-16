/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel
        .find()
        .select('-password -gamesBought -__v')
        .exec();
    } catch (error: unknown) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw new BadRequestException('Não foi possível listar os usuários.');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel
        .findById(id)
        .select('-password -__v')
        .exec();
      if (!user) {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error: unknown) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new BadRequestException(
        'Não foi possível buscar o usuário por email.',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const existingUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
        .select('-password -__v')
        .exec();
      if (!existingUser) {
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para atualização.`,
        );
      }
      return existingUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
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
          throw new ConflictException(
            'Este e-mail já está em uso por outro usuário.',
          );
        }
        if (error.message.includes('username')) {
          throw new ConflictException(
            'Este nome de usuário já está em uso por outro usuário.',
          );
        }
        throw new ConflictException('Conflito de dados ao atualizar usuário.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para remoção.`,
        );
      }
      return deletedUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      throw error;
    }
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async addGameToUserBoughtList(userId: string, gameId: string): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { gamesBought: gameId } }, // $addToSet adiciona o ID se não existir
          { new: true, select: '-password -__v' }, // Retorna o doc atualizado, sem senha e __v
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(
          `Usuário com ID "${userId}" não encontrado para adicionar jogo.`,
        );
      }
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID do usuário ou do jogo possui formato inválido.`,
        );
      }
      console.error(
        `Erro ao adicionar jogo ${gameId} ao usuário ${userId}:`,
        error,
      );
      throw error; // Re-lança outros erros
    }
  }
}
