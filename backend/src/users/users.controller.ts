// backend/src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put, // Para o método update
  Delete, // Para o método remove
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto'; // Importa o DTO
import { UpdateUserDto } from './dtos/update-user.dto'; // Importa o DTO
import { User } from './schemas/user.schema'; // Importa o Schema

@Controller('users') // Define o prefixo da rota para este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para criar um novo usuário
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Rota para buscar todos os usuários
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Rota para buscar um usuário específico pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Rota para atualizar um usuário pelo ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  // Rota para remover um usuário pelo ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna status 204 No Content para remoção bem-sucedida
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
