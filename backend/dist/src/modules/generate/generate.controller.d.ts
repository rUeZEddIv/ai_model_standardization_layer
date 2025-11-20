import { GenerateService } from './generate.service';
import { GenerateRequestDto, GenerateResponseDto } from './dto/generate-request.dto';
export declare class GenerateController {
    private readonly generateService;
    constructor(generateService: GenerateService);
    generate(dto: GenerateRequestDto): Promise<GenerateResponseDto>;
}
