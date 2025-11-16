import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import {
  User,
  AiProvider,
  AiModel,
  UserProviderCredential,
  GenerationJob,
  GeneratedOutput,
} from './entities';
import {
  ModelsController,
  GenerationController,
  WebhookController,
} from './controllers';
import { ModelsService, TextToImageService, WebhookService } from './services';
import { KieTextToImageAdapter, GeminigenTextToImageAdapter } from './adapters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'ai_gateway'),
        entities: [
          User,
          AiProvider,
          AiModel,
          UserProviderCredential,
          GenerationJob,
          GeneratedOutput,
        ],
        synchronize: configService.get('DB_SYNCHRONIZE', true), // Set to false in production
        logging: configService.get('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      AiProvider,
      AiModel,
      UserProviderCredential,
      GenerationJob,
      GeneratedOutput,
    ]),
    HttpModule,
  ],
  controllers: [ModelsController, GenerationController, WebhookController],
  providers: [
    ModelsService,
    TextToImageService,
    WebhookService,
    KieTextToImageAdapter,
    GeminigenTextToImageAdapter,
  ],
})
export class AppModule {}
