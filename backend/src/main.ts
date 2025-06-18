import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- Segurança: Rate Limiting ---
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100,
      message: 'Muitas requisições deste IP, tente novamente após 1 minuto.',
    }),
  );

  // --- Logs: Configuração do Winston ---
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // --- Validação Global de DTOs ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Configuração do Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Epic Games Store - Teste Técnico Edition API') // Título da sua API
    .setDescription(
      'Documentação da API do backend da Epic Games Store - Teste Técnico Edition',
    ) // Descrição da API
    .setVersion('1.0') // Versão da API
    .addTag('games', 'Operações relacionadas a jogos') // Adiciona tags para organizar os endpoints
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('transactions', 'Operações relacionadas a transações de compra')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 'api-docs' é a URL onde o Swagger UI estará disponível

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando na porta ${port}`);
}
bootstrap();
