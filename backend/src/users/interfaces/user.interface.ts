import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User extends Document {
  readonly username: string;
  readonly email: string;
  readonly password?: string;
  readonly gamesBought?: string[];
  readonly role?: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
