// backend/src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true }) // A senha será armazenada como um hash
  password?: string;

  @Prop({ default: 'user' }) // Papel padrão 'user'
  role?: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
