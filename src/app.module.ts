import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersModule } from './modules/providers/providers.module';
import { ModelsModule } from './modules/models/models.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { GenerationModule } from './modules/generation/generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProvidersModule,
    ModelsModule,
    ApiKeysModule,
    JobsModule,
    WebhooksModule,
    GenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
