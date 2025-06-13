import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User extends Document {
  readonly username: string;
  readonly email: string;
  readonly password?: string;
  readonly role?: UserRole; // Usando o enum
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
