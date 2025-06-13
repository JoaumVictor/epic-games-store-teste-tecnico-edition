// backend/src/users/dtos/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType torna todas as propriedades de CreateUserDto opcionais
export class UpdateUserDto extends PartialType(CreateUserDto) {}
