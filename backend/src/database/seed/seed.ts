// backend/src/database/seed/seed.ts
import mongoose, { Model } from 'mongoose'; // Importa mongoose diretamente
import { Game, GameSchema } from '../../games/schemas/game.schema';
import { User, UserSchema } from '../../users/schemas/user.schema';
import {
  Transaction,
  TransactionSchema,
} from '../../transactions/schemas/transaction.schema';

async function bootstrap() {
  const mongoUri = 'mongodb://localhost:27018/game_store';

  // --- Conexão direta com Mongoose ---
  console.log(`Tentando conectar ao MongoDB em: ${mongoUri}`);
  await mongoose.connect(mongoUri);
  const mongooseConnection = mongoose.connection;

  console.log(`Conectado ao MongoDB em: ${mongoUri}`);

  // Obtém os modelos (Models) do Mongoose a partir da conexão ativa
  const gameModel: Model<Game> = mongooseConnection.model(
    Game.name,
    GameSchema,
  );
  const userModel: Model<User> = mongooseConnection.model(
    User.name,
    UserSchema,
  );
  const transactionModel: Model<Transaction> = mongooseConnection.model(
    Transaction.name,
    TransactionSchema,
  );

  // --- Dados de Exemplo ---
  const gamesData = [
    {
      name: 'Cyberpunk 2077',
      description:
        'Um RPG de ação e aventura em mundo aberto ambientado em Night City.',
      cover: 'https://placehold.co/400x600/000000/FFFFFF?text=Cyberpunk+2077',
      banner:
        'https://placehold.co/1200x400/000000/FFFFFF?text=Cyberpunk+2077+Banner',
      price: 199.99,
      discount: 25,
      genre: ['RPG', 'Ação', 'Ficção Científica'],
      releaseDate: new Date('2020-12-10'),
      developer: 'CD Projekt Red',
      publisher: 'CD Projekt',
      platforms: ['PC', 'PS5', 'Xbox Series X'],
      rating: 4.0,
      isFeatured: true,
    },
    {
      name: 'The Witcher 3: Wild Hunt',
      description:
        'Acompanhe Geralt de Rivia em uma épica aventura para encontrar Ciri.',
      cover: 'https://placehold.co/400x600/333333/FFFFFF?text=Witcher+3',
      banner:
        'https://placehold.co/1200x400/333333/FFFFFF?text=Witcher+3+Banner',
      price: 149.99,
      discount: 50,
      genre: ['RPG', 'Fantasia'],
      releaseDate: new Date('2015-05-19'),
      developer: 'CD Projekt Red',
      publisher: 'CD Projekt',
      platforms: ['PC', 'PS4', 'Xbox One', 'Nintendo Switch'],
      rating: 5.0,
      isFeatured: true,
    },
    {
      name: 'Red Dead Redemption 2',
      description:
        'Uma história épica da vida no implacável coração da América.',
      cover: 'https://placehold.co/400x600/660000/FFFFFF?text=RDR2',
      banner: 'https://placehold.co/1200x400/660000/FFFFFF?text=RDR2+Banner',
      price: 179.99,
      discount: 30,
      genre: ['Ação', 'Aventura', 'Western'],
      releaseDate: new Date('2018-10-26'),
      developer: 'Rockstar Studios',
      publisher: 'Rockstar Games',
      platforms: ['PC', 'PS4', 'Xbox One'],
      rating: 4.9,
      isFeatured: false,
    },
    {
      name: 'Minecraft',
      description:
        'Construa mundos, aventure-se e crie em um ambiente de blocos.',
      cover: 'https://placehold.co/400x600/4CAF50/FFFFFF?text=Minecraft',
      banner:
        'https://placehold.co/1200x400/4CAF50/FFFFFF?text=Minecraft+Banner',
      price: 89.99,
      discount: 0,
      genre: ['Sandbox', 'Aventura', 'Construção'],
      releaseDate: new Date('2011-11-18'),
      developer: 'Mojang Studios',
      publisher: 'Xbox Game Studios',
      platforms: ['PC', 'Mobile', 'Consoles'],
      rating: 4.8,
      isFeatured: true,
    },
    {
      name: 'Grand Theft Auto V',
      description: 'Um jogo de ação e aventura em mundo aberto.',
      cover: 'https://placehold.co/400x600/F44336/FFFFFF?text=GTA+V',
      banner: 'https://placehold.co/1200x400/F44336/FFFFFF?text=GTA+V+Banner',
      price: 99.99,
      discount: 40,
      genre: ['Ação', 'Aventura'],
      releaseDate: new Date('2013-09-17'),
      developer: 'Rockstar North',
      publisher: 'Rockstar Games',
      platforms: ['PC', 'PS3', 'PS4', 'Xbox 360', 'Xbox One'],
      rating: 4.7,
      isFeatured: false,
    },
    {
      name: 'Among Us',
      description: 'Um jogo de dedução social em um cenário espacial.',
      cover: 'https://placehold.co/400x600/FFC107/000000?text=Among+Us',
      banner:
        'https://placehold.co/1200x400/FFC107/000000?text=Among+Us+Banner',
      price: 29.99,
      discount: 10,
      genre: ['Social Deduction', 'Casual'],
      releaseDate: new Date('2018-06-15'),
      developer: 'Innersloth',
      publisher: 'Innersloth',
      platforms: ['PC', 'Mobile', 'Nintendo Switch'],
      rating: 3.9,
      isFeatured: false,
    },
    {
      name: 'Elden Ring',
      description:
        'Um RPG de ação de fantasia épica em um vasto mundo sombrio.',
      cover: 'https://placehold.co/400x600/795548/FFFFFF?text=Elden+Ring',
      banner:
        'https://placehold.co/1200x400/795548/FFFFFF?text=Elden+Ring+Banner',
      price: 249.99,
      discount: 0,
      genre: ['RPG', 'Ação', 'Fantasia'],
      releaseDate: new Date('2022-02-25'),
      developer: 'FromSoftware',
      publisher: 'Bandai Namco Entertainment',
      platforms: ['PC', 'PS5', 'Xbox Series X'],
      rating: 4.9,
      isFeatured: true,
    },
    {
      name: 'God of War (2018)',
      description:
        'Kratos e seu filho Atreus embarcam em uma jornada épica no reino nórdico.',
      cover: 'https://placehold.co/400x600/2196F3/FFFFFF?text=God+of+War',
      banner:
        'https://placehold.co/1200x400/2196F3/FFFFFF?text=God+of+War+Banner',
      price: 159.99,
      discount: 20,
      genre: ['Ação', 'Aventura'],
      releaseDate: new Date('2018-04-20'),
      developer: 'Santa Monica Studio',
      publisher: 'Sony Interactive Entertainment',
      platforms: ['PS4', 'PC'],
      rating: 5.0,
      isFeatured: false,
    },
    {
      name: 'Stardew Valley',
      description:
        'Transforme uma fazenda abandonada em uma vibrante fazenda dos seus sonhos.',
      cover: 'https://placehold.co/400x600/8BC34A/FFFFFF?text=Stardew+Valley',
      banner:
        'https://placehold.co/1200x400/8BC34A/FFFFFF?text=Stardew+Valley+Banner',
      price: 49.99,
      discount: 0,
      genre: ['Simulação', 'RPG'],
      releaseDate: new Date('2016-02-26'),
      developer: 'ConcernedApe',
      publisher: 'ConcernedApe',
      platforms: ['PC', 'Switch', 'PS4', 'Xbox One', 'Mobile'],
      rating: 4.8,
      isFeatured: false,
    },
    {
      name: 'Hades',
      description: 'Um roguelike de ação onde você desafia o deus da morte.',
      cover: 'https://placehold.co/400x600/9C27B0/FFFFFF?text=Hades',
      banner: 'https://placehold.co/1200x400/9C27B0/FFFFFF?text=Hades+Banner',
      price: 79.99,
      discount: 10,
      genre: ['Roguelike', 'Ação'],
      releaseDate: new Date('2020-09-17'),
      developer: 'Supergiant Games',
      publisher: 'Supergiant Games',
      platforms: ['PC', 'Switch', 'PS4', 'Xbox One'],
      rating: 4.9,
      isFeatured: true,
    },
  ];

  const usersData = [
    {
      username: 'victor_dev',
      email: 'victor.dev@example.com',
      password: 'hashedpassword1', // Em um app real, use bcrypt para hash
      role: 'admin',
    },
    {
      username: 'player_one',
      email: 'player.one@example.com',
      password: 'hashedpassword2',
      role: 'user',
    },
    {
      username: 'gamer_girl',
      email: 'gamer.girl@example.com',
      password: 'hashedpassword3',
      role: 'user',
    },
  ];

  // --- Limpar coleções existentes ---
  console.log('Limpando coleções existentes...');
  await gameModel.deleteMany({});
  await userModel.deleteMany({});
  await transactionModel.deleteMany({});
  console.log('Coleções limpas.');

  // --- Inserir Usuários ---
  console.log('Inserindo usuários...');
  const insertedUsers = await userModel.insertMany(usersData);
  console.log('Usuários inseridos:', insertedUsers.length);

  // --- Inserir Jogos ---
  console.log('Inserindo jogos...');
  const insertedGames = await gameModel.insertMany(gamesData);
  console.log('Jogos inseridos:', insertedGames.length);

  console.log('Dados de exemplo inseridos com sucesso!');
  await mongooseConnection.close(); // Fecha a conexão com o banco
  console.log('Conexão com MongoDB fechada.');
}

bootstrap().catch((e: unknown) => {
  if (e instanceof Error) {
    console.error('Erro ao popular o banco de dados:', e.message);
  } else {
    console.error('Erro ao popular o banco de dados:', e);
  }
  process.exit(1);
});
