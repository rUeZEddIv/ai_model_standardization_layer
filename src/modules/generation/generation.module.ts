import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [GenerationController],
})
export class GenerationModule {}
