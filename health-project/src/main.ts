import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strips unknown fields
      forbidNonWhitelisted: true,
      transform: true,           // converts payloads to DTO instances
    }),
  );

  await app.listen(3000);

  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes = router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      method: Object.keys(layer.route.methods)[0].toUpperCase(),
      path: layer.route.path,
    }));

  console.log('Available Routes:', availableRoutes);
  console.log('Server is running on http://localhost:3000');
}
bootstrap();
