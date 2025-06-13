
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importa ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão definidas no DTO
    forbidNonWhitelisted: true, // Lança um erro se propriedades não definidas forem enviadas
    transform: true, // Transforma o payload do request para a instância do DTO
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando na porta ${port}`);
}
bootstrap();