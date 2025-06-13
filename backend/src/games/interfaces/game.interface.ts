import { Document } from 'mongoose';

export interface Game extends Document {
  readonly name: string; // Nome do jogo
  readonly description: string; // Descrição detalhada do jogo
  readonly cover: string; // URL da imagem de capa do jogo
  readonly banner: string; // URL da imagem de banner do jogo
  readonly price: number; // Preço do jogo
  readonly discount?: number; // Desconto em porcentagem (opcional)
  readonly genre?: string[]; // Gêneros do jogo (ex: ["RPG", "Aventura"])
  readonly releaseDate?: Date; // Data de lançamento
  readonly developer?: string; // Desenvolvedor
  readonly publisher?: string; // Publicadora
  readonly platforms?: string[]; // Plataformas disponíveis (ex: ["PC", "PlayStation"])
  readonly rating?: number; // Avaliação do jogo (ex: 1 a 5 estrelas)
  readonly isFeatured?: boolean; // Se o jogo está em destaque
  readonly createdAt: Date; // Data de criação do registro
  readonly updatedAt: Date; // Data da última atualização do registro
}
