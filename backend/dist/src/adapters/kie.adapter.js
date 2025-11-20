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
var KieAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KieAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let KieAdapter = KieAdapter_1 = class KieAdapter {
    configService;
    logger = new common_1.Logger(KieAdapter_1.name);
    apiKey;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('KIE_API_KEY') || '';
        this.baseUrl = this.configService.get('KIE_BASE_URL') || 'https://api.kie.ai';
    }
    getProviderName() {
        return 'KIE.AI';
    }
    async generate(payload) {
        this.logger.log(`Generating content with KIE.AI: ${JSON.stringify(payload)}`);
        try {
            const kiePayload = this.mapToKieFormat(payload);
            const response = await fetch(`${this.baseUrl}${this.getEndpoint(payload.category)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(kiePayload),
            });
            const data = await response.json();
            if (data.code !== 200) {
                throw new Error(data.msg || 'KIE.AI generation failed');
            }
            return {
                taskId: data.data.taskId,
                status: 'PENDING',
                rawResponse: data,
            };
        }
        catch (error) {
            this.logger.error(`KIE.AI generation error: ${error.message}`);
            throw error;
        }
    }
    async handleWebhook(payload) {
        this.logger.log(`Handling KIE.AI webhook: ${JSON.stringify(payload)}`);
        return {
            taskId: payload.taskId || payload.data?.taskId,
            status: this.mapKieStatus(payload.status || payload.data?.status),
            outputResult: {
                urls: payload.data?.imageUrls || payload.data?.videoUrls || payload.data?.audioUrls || [],
                data: payload.data,
            },
            errorMessage: payload.error || payload.msg,
        };
    }
    mapToKieFormat(payload) {
        const { category, data, model } = payload;
        const kiePayload = {
            prompt: data.prompt,
            callBackUrl: data.callbackUrl,
        };
        switch (category) {
            case 'text-to-image':
                return {
                    ...kiePayload,
                    aspectRatio: data.aspectRatio,
                    model: model.externalModelId,
                    outputFormat: data.outputFormat || 'jpeg',
                    enableTranslation: data.enableTranslation !== false,
                };
            case 'image-to-image':
                return {
                    ...kiePayload,
                    inputImage: data.uploadedImages?.[0],
                    aspectRatio: data.aspectRatio,
                    model: model.externalModelId,
                };
            case 'text-to-video':
                return {
                    ...kiePayload,
                    aspectRatio: data.aspectRatio,
                    duration: data.duration,
                    model: model.externalModelId,
                };
            case 'image-to-video':
                return {
                    ...kiePayload,
                    inputImage: data.uploadedImages?.[0],
                    duration: data.duration,
                    aspectRatio: data.aspectRatio,
                    model: model.externalModelId,
                };
            default:
                return kiePayload;
        }
    }
    getEndpoint(category) {
        const endpoints = {
            'text-to-image': '/api/v1/flux/kontext/generate',
            'image-to-image': '/api/v1/flux/kontext/generate',
            'text-to-video': '/api/v1/sora/generate',
            'image-to-video': '/api/v1/sora/generate',
        };
        return endpoints[category] || '/api/v1/generate';
    }
    mapKieStatus(kieStatus) {
        if (typeof kieStatus === 'string') {
            const status = kieStatus.toLowerCase();
            if (status.includes('complete') || status.includes('success'))
                return 'COMPLETED';
            if (status.includes('process') || status.includes('running'))
                return 'PROCESSING';
            if (status.includes('fail') || status.includes('error'))
                return 'FAILED';
        }
        return 'PENDING';
    }
};
exports.KieAdapter = KieAdapter;
exports.KieAdapter = KieAdapter = KieAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KieAdapter);
//# sourceMappingURL=kie.adapter.js.map