import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { KieAdapter } from '../../adapters/kie.adapter';
import { GeminiGenAdapter } from '../../adapters/geminigen.adapter';
import { AdapterFactory } from '../../adapters/adapter.factory';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, KieAdapter, GeminiGenAdapter, AdapterFactory],
  exports: [GenerateService],
})
export class GenerateModule {}
