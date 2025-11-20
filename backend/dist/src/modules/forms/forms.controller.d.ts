import { FormSchemaService } from './form-schema.service';
import { FormSchema } from './interfaces/form-schema.interface';
export declare class FormsController {
    private readonly formSchemaService;
    constructor(formSchemaService: FormSchemaService);
    getFormSchema(categorySlug: string, aiModelId?: string): Promise<FormSchema>;
}
