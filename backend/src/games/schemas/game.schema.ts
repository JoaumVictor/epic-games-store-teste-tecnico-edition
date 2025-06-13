import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Decorador @Schema indica que esta é uma classe de schema
@Schema({ timestamps: true }) // Adiciona campos createdAt e updatedAt automaticamente
export class Game extends Document {
  @Prop({ required: true, unique: true }) // Campo obrigatório e único
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  cover: string; // URL da imagem de capa

  @Prop({ required: true })
  banner: string; // URL da imagem de banner

  @Prop({ required: true, min: 0 }) // Preço, não pode ser negativo
  price: number;

  @Prop({ min: 0, max: 100, default: 0 }) // Desconto em porcentagem, de 0 a 100
  discount?: number;

  @Prop([String]) // Array de strings para gêneros
  genre?: string[];

  @Prop({ type: Date }) // Data de lançamento
  releaseDate?: Date;

  @Prop()
  developer?: string;

  @Prop()
  publisher?: string;

  @Prop([String]) // Array de strings para plataformas
  platforms?: string[];

  @Prop({ min: 1, max: 5 }) // Avaliação, de 1 a 5 estrelas
  rating?: number;

  @Prop({ default: false }) // Se o jogo está em destaque
  isFeatured?: boolean;
}

// Cria o schema a partir da classe
export const GameSchema = SchemaFactory.createForClass(Game);
