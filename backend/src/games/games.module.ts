// backend/src/games/games.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game, GameSchema } from './schemas/game.schema'; // Importa o Schema

@Module({
  imports: [
    // Registra o modelo Game para ser usado com Mongoose
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GamesController], // Declara os controladores deste módulo
  providers: [GamesService], // Declara os provedores (serviços) deste módulo
  exports: [GamesService], // Exporta o serviço caso outros módulos precisem dele
})
export class GamesModule {}
