import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome de usuário único', example: 'victor_dev' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'victor.dev@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'minhasenhaforte123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
