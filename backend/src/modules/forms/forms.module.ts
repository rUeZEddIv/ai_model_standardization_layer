import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormSchemaService } from './form-schema.service';

@Module({
  controllers: [FormsController],
  providers: [FormSchemaService],
  exports: [FormSchemaService],
})
export class FormsModule {}
