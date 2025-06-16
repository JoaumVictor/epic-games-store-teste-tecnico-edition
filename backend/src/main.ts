/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  // --- Segurança: Rate Limiting ---
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 20,
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando na porta ${port}`);
}
bootstrap();
