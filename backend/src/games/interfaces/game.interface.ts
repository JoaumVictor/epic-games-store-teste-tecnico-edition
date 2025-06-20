import { Document } from 'mongoose';

export interface Game extends Document {
  readonly name: string;
  readonly description: string;
  readonly cover: string;
  readonly banner: string;
  readonly price: number;
  readonly discount?: number;
  readonly genre?: string[];
  readonly releaseDate?: Date;
  readonly developer?: string;
  readonly publisher?: string;
  readonly platforms?: string[];
  readonly rating?: number;
  readonly isFeatured?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
