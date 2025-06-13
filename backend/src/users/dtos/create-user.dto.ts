// backend/src/users/dtos/create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3) // Exige que o username tenha no mínimo 3 caracteres
  username: string;

  @IsEmail() // Valida que é um formato de e-mail válido
  email: string;

  @IsString()
  @MinLength(6) // Exige que a senha tenha no mínimo 6 caracteres (mínimo para ser hasheada depois)
  password: string;

  // Se você quiser permitir definir o papel na criação, senão remova
  // @IsOptional()
  // @IsEnum(UserRole) // Garante que o papel seja 'user' ou 'admin'
  // role?: UserRole;
}
