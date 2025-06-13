// backend/src/games/dtos/create-game.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  Max,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl() // Valida se é uma URL válida
  cover: string;

  @IsUrl() // Valida se é uma URL válida
  banner: string;

  @IsNumber()
  @Min(0) // Preço não pode ser negativo
  price: number;

  @IsOptional() // Campo opcional
  @IsNumber()
  @Min(0)
  @Max(100) // Desconto deve ser entre 0 e 100
  discount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Cada item do array deve ser string
  genre?: string[];

  @IsOptional()
  @IsDateString() // Valida se é uma string de data válida
  releaseDate?: string;

  @IsOptional()
  @IsString()
  developer?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5) // Avaliação entre 1 e 5
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
