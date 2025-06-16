/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// backend/src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException, // Para erros de duplicidade
  BadRequestException, // Para IDs inválidos
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose'; // Importa Error do Mongoose
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Método para criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Em um cenário real, você faria o hash da senha aqui antes de salvar
      // Ex: const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      // const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      // Verifica se é um erro de duplicidade de chave (código 11000 do MongoDB)
      if (error.code === 11000) {
        // Você pode inspecionar `error.message` para saber qual campo (email/username) causou o conflito
        if (error.message.includes('email')) {
          throw new ConflictException('Já existe um usuário com este e-mail.');
        }
        if (error.message.includes('username')) {
          throw new ConflictException(
            'Já existe um usuário com este nome de usuário.',
          );
        }
        // Caso não seja nenhum dos campos esperados, erro genérico
        throw new ConflictException('Conflito de dados ao criar usuário.');
      }
      throw error;
    }
  }

  // Método para encontrar todos os usuários
  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw new BadRequestException('Não foi possível listar os usuários.');
    }
  }

  // Método para encontrar um usuário pelo ID
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
      }
      return user;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`ID "${id}" possui formato inválido.`);
      }
      throw error;
    }
  }

  // Exemplo de método para encontrar um usuário por email
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      // Este método não deve lançar 404 se não encontrar, apenas retornar null
      // mas pode lançar erros de conexão ou outros problemas.
      console.error('Erro ao buscar usuário por email:', error);
      throw new BadRequestException(
        'Não foi possível buscar o usuário por email.',
      );
    }
  }

  // Método para atualização de usuário
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
        .exec();
      if (!existingUser) {
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para atualização.`,
        );
      }
      return existingUser;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para atualização.`,
        );
      }
      // Verifica se é um erro de duplicidade de chave ao tentar atualizar email/username
      if (error?.code === 11000) {
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

  // Método para remover um usuário
  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(
          `Usuário com ID "${id}" não encontrado para remoção.`,
        );
      }
      return deletedUser;
    } catch (error) {
      // Captura erros de formato de ID inválido (CastError)
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(
          `ID "${id}" possui formato inválido para remoção.`,
        );
      }
      throw error;
    }
  }
}
