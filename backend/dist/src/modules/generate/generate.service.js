"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const adapter_factory_1 = require("../../adapters/adapter.factory");
let GenerateService = class GenerateService {
    prisma;
    adapterFactory;
    constructor(prisma, adapterFactory) {
        this.prisma = prisma;
        this.adapterFactory = adapterFactory;
    }
    async generate(dto, userId) {
        const model = await this.prisma.aIModel.findUnique({
            where: { id: dto.aiModelId },
            include: {
                provider: true,
                category: true,
            },
        });
        if (!model) {
            throw new common_1.NotFoundException(`Model '${dto.aiModelId}' not found`);
        }
        if (model.category.slug !== dto.categoryId) {
            throw new common_1.BadRequestException(`Model '${dto.aiModelId}' does not belong to category '${dto.categoryId}'`);
        }
        this.validateInputData(dto.data, model.capabilities, model.category.slug);
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                modelId: model.id,
                status: 'PENDING',
                inputPayload: dto.data,
            },
        });
        try {
            const adapter = this.adapterFactory.getAdapter(model.provider.slug);
            const result = await adapter.generate({
                category: model.category.slug,
                data: dto.data,
                model: {
                    externalModelId: model.externalModelId,
                    name: model.name,
                },
            });
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: result.status,
                    providerResponse: result.rawResponse,
                },
            });
            return {
                transactionId: transaction.id,
                taskId: result.taskId,
                status: result.status,
                message: 'Generation request submitted successfully',
            };
        }
        catch (error) {
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'FAILED',
                    errorMessage: error.message,
                },
            });
            throw error;
        }
    }
    validateInputData(data, capabilities, categorySlug) {
        if (data.aspectRatio && capabilities.ratios) {
            if (!capabilities.ratios.includes(data.aspectRatio)) {
                throw new common_1.BadRequestException(`Invalid aspect ratio '${data.aspectRatio}'. Supported ratios: ${capabilities.ratios.join(', ')}`);
            }
        }
        if (data.resolution && capabilities.resolutions) {
            if (!capabilities.resolutions.includes(data.resolution)) {
                throw new common_1.BadRequestException(`Invalid resolution '${data.resolution}'. Supported resolutions: ${capabilities.resolutions.join(', ')}`);
            }
        }
        if (data.duration && capabilities.durations) {
            if (!capabilities.durations.includes(data.duration)) {
                throw new common_1.BadRequestException(`Invalid duration '${data.duration}'. Supported durations: ${capabilities.durations.join(', ')} seconds`);
            }
        }
        switch (categorySlug) {
            case 'text-to-image':
            case 'image-to-image':
                if (!data.prompt) {
                    throw new common_1.BadRequestException('Prompt is required');
                }
                break;
            case 'text-to-video':
            case 'image-to-video':
                if (!data.prompt && categorySlug === 'text-to-video') {
                    throw new common_1.BadRequestException('Prompt is required for text-to-video');
                }
                break;
            case 'speech-to-text':
                if (!data.uploadedAudio) {
                    throw new common_1.BadRequestException('Audio file is required');
                }
                break;
            case 'text-to-speech':
                if (!data.text) {
                    throw new common_1.BadRequestException('Text is required');
                }
                if (!data.voiceId) {
                    throw new common_1.BadRequestException('Voice ID is required');
                }
                break;
        }
    }
};
exports.GenerateService = GenerateService;
exports.GenerateService = GenerateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        adapter_factory_1.AdapterFactory])
], GenerateService);
//# sourceMappingURL=generate.service.js.map