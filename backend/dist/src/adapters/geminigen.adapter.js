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
var GeminiGenAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiGenAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GeminiGenAdapter = GeminiGenAdapter_1 = class GeminiGenAdapter {
    configService;
    logger = new common_1.Logger(GeminiGenAdapter_1.name);
    apiKey;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('GEMINIGEN_API_KEY') || '';
        this.baseUrl = this.configService.get('GEMINIGEN_BASE_URL') || 'https://api.geminigen.ai';
    }
    getProviderName() {
        return 'GEMINIGEN.AI';
    }
    async generate(payload) {
        this.logger.log(`Generating content with GeminiGen.AI: ${JSON.stringify(payload)}`);
        try {
            const geminiPayload = this.mapToGeminiFormat(payload);
            const response = await fetch(`${this.baseUrl}${this.getEndpoint(payload.category)}`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(geminiPayload),
            });
            const data = await response.json();
            if (!data.success && !data.uuid) {
                throw new Error(data.error_message || 'GeminiGen.AI generation failed');
            }
            return {
                taskId: data.uuid || data.result?.uuid,
                status: 'PENDING',
                rawResponse: data,
            };
        }
        catch (error) {
            this.logger.error(`GeminiGen.AI generation error: ${error.message}`);
            throw error;
        }
    }
    async handleWebhook(payload) {
        this.logger.log(`Handling GeminiGen.AI webhook: ${JSON.stringify(payload)}`);
        return {
            taskId: payload.uuid || payload.id,
            status: this.mapGeminiStatus(payload.status),
            outputResult: {
                urls: [payload.generate_result].filter(Boolean),
                data: payload,
            },
            errorMessage: payload.error_message,
        };
    }
    mapToGeminiFormat(payload) {
        const { category, data, model } = payload;
        switch (category) {
            case 'text-to-image':
                return {
                    prompt: data.prompt,
                    model: model.externalModelId,
                    aspect_ratio: data.aspectRatio || '1:1',
                    style: data.style || 'None',
                    service_mode: 'unstable',
                };
            case 'text-to-video':
                return {
                    prompt: data.prompt,
                    model: model.externalModelId,
                    aspect_ratio: data.aspectRatio || '16:9',
                    duration: data.duration || 5,
                };
            case 'text-to-speech':
                return {
                    model: model.externalModelId,
                    voices: data.voices || [{
                            name: 'Default',
                            voice: { id: data.voiceId, name: 'Default' }
                        }],
                    speed: data.speed || 1,
                    input: data.text,
                    output_format: data.outputFormat || 'mp3',
                };
            case 'text-to-speech-multi':
                return {
                    model: model.externalModelId,
                    voices: data.speakers.map((speaker) => ({
                        name: speaker.name || 'Speaker',
                        voice: { id: speaker.voiceId, name: speaker.name || 'Speaker' }
                    })),
                    speed: data.speed || 1,
                    input: data.speakers.map((s) => s.text).join('\n'),
                    output_format: data.outputFormat || 'mp3',
                };
            default:
                return {
                    prompt: data.prompt,
                    model: model.externalModelId,
                };
        }
    }
    getEndpoint(category) {
        const endpoints = {
            'text-to-image': '/uapi/v1/generate_image',
            'text-to-video': '/uapi/v1/generate_video',
            'text-to-speech': '/uapi/v1/text-to-speech',
            'text-to-speech-multi': '/uapi/v1/text-to-speech',
            'speech-to-text': '/uapi/v1/speech-to-text',
        };
        return endpoints[category] || '/uapi/v1/generate';
    }
    mapGeminiStatus(geminiStatus) {
        switch (geminiStatus) {
            case 1:
                return 'PROCESSING';
            case 2:
                return 'COMPLETED';
            case 3:
                return 'FAILED';
            default:
                return 'PENDING';
        }
    }
};
exports.GeminiGenAdapter = GeminiGenAdapter;
exports.GeminiGenAdapter = GeminiGenAdapter = GeminiGenAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiGenAdapter);
//# sourceMappingURL=geminigen.adapter.js.map