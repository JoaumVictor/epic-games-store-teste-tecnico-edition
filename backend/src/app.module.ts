import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para acessar as variáveis de ambiente
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Obtém a URI do MongoDB das variáveis de ambiente
      }),
      inject: [ConfigService], // Injeta o ConfigService no useFactory
    }),
    GamesModule,
    UsersModule,
    TransactionsModule,
  ],
  controllers: [], // Controladores globais (raramente usados)
  providers: [], // Provedores globais (raramente usados)
})
export class AppModule {}
