import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KieAdapter } from './adapters/kie.adapter';
import { GeminiGenAdapter } from './adapters/geminigen.adapter';

@Module({
  imports: [ConfigModule],
  providers: [KieAdapter, GeminiGenAdapter],
  exports: [KieAdapter, GeminiGenAdapter],
})
export class ProvidersModule {}
