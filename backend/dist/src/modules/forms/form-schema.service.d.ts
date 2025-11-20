import { PrismaService } from '../../prisma/prisma.service';
import { FormSchema } from './interfaces/form-schema.interface';
export declare class FormSchemaService {
    private prisma;
    constructor(prisma: PrismaService);
    getFormSchema(categorySlug: string, aiModelId?: string): Promise<FormSchema>;
    private buildFormSchema;
    private buildTextToImageSchema;
    private buildImageToImageSchema;
    private buildTextToVideoSchema;
    private buildImageToVideoSchema;
    private buildAudioToVideoSchema;
    private buildStoryboardToVideoSchema;
    private buildTextToMusicSchema;
    private buildSpeechToTextSchema;
    private buildTextToSpeechSchema;
    private buildTextToSpeechMultiSchema;
    private formatRatioLabel;
    private formatLanguageLabel;
    private formatStyleLabel;
}
