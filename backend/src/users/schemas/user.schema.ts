import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({ description: 'Nome de usuário único', example: 'victor_dev' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: 'Endereço de e-mail único do usuário',
    example: 'victor.dev@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiHideProperty() // Oculta a propriedade password do Swagger UI
  @Prop({ required: true })
  password?: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: ['user', 'admin'],
    example: 'user',
  })
  @Prop({ default: 'user' })
  role?: 'user' | 'admin';

  @ApiProperty({
    description: 'Lista de IDs de jogos comprados pelo usuário',
    type: [String],
    example: ['60c72b2f9b1d8c001c8e4d21', '60c72b2f9b1d8c001c8e4d23'],
  })
  @Prop({ default: [] })
  gamesBought?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
