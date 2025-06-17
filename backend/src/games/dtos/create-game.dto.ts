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
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    description: 'Nome único do jogo',
    example: 'The Witcher 3: Wild Hunt',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do jogo',
    example: 'Um RPG de mundo aberto aclamado.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL da imagem de capa do jogo',
    example: 'https://example.com/witcher3_cover.jpg',
  })
  @IsUrl()
  cover: string;

  @ApiProperty({
    description: 'URL da imagem de banner do jogo',
    example: 'https://example.com/witcher3_banner.jpg',
  })
  @IsUrl()
  banner: string;

  @ApiProperty({ description: 'Preço base do jogo', example: 59.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Percentual de desconto aplicado (0-100)',
    required: false,
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    description: 'Lista de gêneros do jogo',
    required: false,
    example: ['RPG', 'Aventura'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @ApiProperty({
    description: 'Data de lançamento do jogo (ISO 8601)',
    required: false,
    example: '2015-05-19T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiProperty({
    description: 'Nome do desenvolvedor do jogo',
    required: false,
    example: 'CD Projekt Red',
  })
  @IsOptional()
  @IsString()
  developer?: string;

  @ApiProperty({
    description: 'Nome da publicadora do jogo',
    required: false,
    example: 'CD Projekt',
  })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({
    description: 'Lista de plataformas disponíveis',
    required: false,
    example: ['PC', 'PS4'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiProperty({
    description: 'Avaliação média do jogo (1 a 5 estrelas)',
    required: false,
    example: 4.8,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Indica se o jogo está em destaque',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
