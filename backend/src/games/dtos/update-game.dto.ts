// backend/src/games/dtos/update-game.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

// PartialType faz com que todas as propriedades do CreateGameDto se tornem opcionais
export class UpdateGameDto extends PartialType(CreateGameDto) {}
