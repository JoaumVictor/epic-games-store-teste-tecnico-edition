import mongoose, { Model } from 'mongoose';
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
      cover:
        'https://cdna.artstation.com/p/assets/images/images/033/037/886/large/artur-tarnowski-malemain.jpg?1608208334',
      banner:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cyberpunk_2077_logo.svg/2560px-Cyberpunk_2077_logo.svg.png',
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
      cover:
        'https://www.thewitcher.com/_next/image?url=https%3A%2F%2Fstatic.cdprojektred.com%2Fcms.cdprojektred.com%2F16x9_big%2Ffcaa0ba91e2368e2aef8c0d556692307768fad49-1920x1080.jpg&w=1920&q=75',
      banner:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/EN_The-Witcher-3_Logo-Black_RGB.svg/2560px-EN_The-Witcher-3_Logo-Black_RGB.svg.png',
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
      cover:
        'https://cdn.rocketchainsaw.com.au/wp-content/uploads/2018/05/Red-Dead-Redemption-2-New-Logo.jpg',
      banner:
        'https://upload.wikimedia.org/wikipedia/commons/2/22/Red_Dead_Redemption_2_Logo.png',
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
      name: 'Grand Theft Auto V',
      description: 'Um jogo de ação e aventura em mundo aberto.',
      cover:
        'https://cdn.awsli.com.br/2500x2500/1610/1610163/produto/177700809/poster-grand-theft-auto-v-gta-5-b-5ceeda64.jpg',
      banner:
        'https://i.redd.it/logo-comparison-gtav-vs-gtavi-v0-f39oasf942ce1.png?width=2400&format=png&auto=webp&s=606326c7f350f41cdf00126b8f50cadc3efa40ed',
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
      name: 'Elden Ring',
      description:
        'Um RPG de ação de fantasia épica em um vasto mundo sombrio.',
      cover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__eBA_kN-v83GvCsfu9uhywzGCj4HROBwNw&s',
      banner:
        'https://cdn2.steamgriddb.com/logo/069026dd46efb390001a2661e32c84c4.png',
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
      cover:
        'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/06/god-of-war-2018-cover-art.jpg',
      banner:
        'https://upload.wikimedia.org/wikipedia/pt/4/4b/God_of_War_2018_logo.png',
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
  ];

  const usersData = [
    {
      username: 'victor_dev',
      email: 'victor.dev@example.com',
      password: 'hashedpassword1',
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
  await mongooseConnection.close();
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
