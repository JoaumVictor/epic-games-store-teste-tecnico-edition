import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string; // Nome de usuário
  readonly email: string; // Email do usuário
  readonly password?: string; // Senha (hashada, nunca em texto puro!)
  readonly role?: 'user' | 'admin'; // Papel do usuário
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
