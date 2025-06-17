export interface Game {
  _id: string;
  name: string;
  description: string;
  cover: string;
  banner: string;
  price: number;
  discount?: number;
  genre?: string[];
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  platforms?: string[];
  rating?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}
