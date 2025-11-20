import { PrismaService } from '../../prisma/prisma.service';
import { AdapterFactory } from '../../adapters/adapter.factory';
import { GenerateRequestDto, GenerateResponseDto } from './dto/generate-request.dto';
export declare class GenerateService {
    private prisma;
    private adapterFactory;
    constructor(prisma: PrismaService, adapterFactory: AdapterFactory);
    generate(dto: GenerateRequestDto, userId?: string): Promise<GenerateResponseDto>;
    private validateInputData;
}
