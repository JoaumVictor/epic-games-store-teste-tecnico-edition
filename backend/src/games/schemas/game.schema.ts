import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Game extends Document {
  @ApiProperty({
    description: 'Nome único do jogo',
    example: 'The Witcher 3: Wild Hunt',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do jogo',
    example: 'Um RPG de mundo aberto aclamado.',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'URL da imagem de capa do jogo',
    example: 'https://example.com/witcher3_cover.jpg',
  })
  @Prop({ required: true })
  cover: string;

  @ApiProperty({
    description: 'URL da imagem de banner do jogo',
    example: 'https://example.com/witcher3_banner.jpg',
  })
  @Prop({ required: true })
  banner: string;

  @ApiProperty({ description: 'Preço base do jogo', example: 59.99 })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({
    description: 'Percentual de desconto aplicado (0-100)',
    required: false,
    example: 15,
  })
  @Prop({ min: 0, max: 100, default: 0 })
  discount?: number;

  @ApiProperty({
    description: 'Lista de gêneros do jogo',
    required: false,
    example: ['RPG', 'Aventura'],
  })
  @Prop([String])
  genre?: string[];

  @ApiProperty({
    description: 'Data de lançamento do jogo (ISO 8601)',
    required: false,
    example: '2015-05-19T00:00:00.000Z',
  })
  @Prop({ type: Date })
  releaseDate?: Date;

  @ApiProperty({
    description: 'Nome do desenvolvedor do jogo',
    required: false,
    example: 'CD Projekt Red',
  })
  @Prop()
  developer?: string;

  @ApiProperty({
    description: 'Nome da publicadora do jogo',
    required: false,
    example: 'CD Projekt',
  })
  @Prop()
  publisher?: string;

  @ApiProperty({
    description: 'Lista de plataformas disponíveis',
    required: false,
    example: ['PC', 'PS4'],
  })
  @Prop([String])
  platforms?: string[];

  @ApiProperty({
    description: 'Avaliação média do jogo (1 a 5 estrelas)',
    required: false,
    example: 4.8,
  })
  @Prop({ min: 1, max: 5 })
  rating?: number;

  @ApiProperty({
    description: 'Indica se o jogo está em destaque',
    required: false,
    example: true,
  })
  @Prop({ default: false })
  isFeatured?: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
