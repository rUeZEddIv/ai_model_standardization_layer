import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('AI Model Standardization Layer')
    .setDescription(
      'Unified API for multiple AI generation providers including text-to-image, text-to-video, text-to-speech, and more',
    )
    .setVersion('1.0')
    .addTag('Generation', 'Unified generation endpoints for all AI models')
    .addTag('Providers', 'Manage AI providers')
    .addTag('Models', 'Manage AI models')
    .addTag('API Keys', 'Manage provider API keys')
    .addTag('Jobs', 'View job status and history')
    .addTag('Webhooks', 'Handle provider webhooks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
