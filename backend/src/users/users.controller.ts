// backend/src/users/users.controller.ts
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Em um projeto real, aqui você teria rotas para:
  // - Criação de usuário (POST /users)
  // - Login (POST /auth/login)
  // - Busca de usuários (GET /users)
  // - Atualização de perfil (PUT /users/:id)
  // - Exclusão de conta (DELETE /users/:id)
}
