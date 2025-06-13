// backend/src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto'; // Importa o DTO
import { UpdateUserDto } from './dtos/update-user.dto'; // Importa o DTO

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Método para criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Em um cenário real, você faria o hash da senha aqui antes de salvar
    // Ex: const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    const createdUser = new this.userModel(createUserDto); // Por enquanto, salva como está
    return createdUser.save();
  }

  // Método para encontrar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Método para encontrar um usuário pelo ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return user;
  }

  // Exemplo de método para encontrar um usuário por email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Você pode adicionar métodos para atualização e remoção mais tarde
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return existingUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return deletedUser;
  }
}
