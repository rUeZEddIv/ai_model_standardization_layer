import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { KieAdapter } from '../../adapters/kie.adapter';
import { GeminiGenAdapter } from '../../adapters/geminigen.adapter';
import { AdapterFactory } from '../../adapters/adapter.factory';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, KieAdapter, GeminiGenAdapter, AdapterFactory],
})
export class WebhookModule {}
