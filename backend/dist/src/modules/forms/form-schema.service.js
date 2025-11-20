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
exports.FormSchemaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FormSchemaService = class FormSchemaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFormSchema(categorySlug, aiModelId) {
        const category = await this.prisma.formCategory.findUnique({
            where: { slug: categorySlug },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category '${categorySlug}' not found`);
        }
        if (!aiModelId) {
            const models = await this.prisma.aIModel.findMany({
                where: {
                    categoryId: category.id,
                    isActive: true,
                },
                include: {
                    provider: true,
                },
            });
            return {
                meta: {
                    categoryId: category.slug,
                    categoryName: category.name,
                    availableModels: models.map(m => ({
                        id: m.id,
                        name: m.name,
                        provider: m.provider.name,
                    })),
                },
                schema: [],
            };
        }
        const model = await this.prisma.aIModel.findUnique({
            where: { id: aiModelId },
            include: {
                provider: true,
                category: true,
            },
        });
        if (!model) {
            throw new common_1.NotFoundException(`Model '${aiModelId}' not found`);
        }
        if (model.categoryId !== category.id) {
            throw new common_1.NotFoundException(`Model '${aiModelId}' does not belong to category '${categorySlug}'`);
        }
        const schema = this.buildFormSchema(category.slug, model.capabilities);
        return {
            meta: {
                categoryId: category.slug,
                categoryName: category.name,
                selectedModel: model.name,
            },
            schema,
        };
    }
    buildFormSchema(categorySlug, capabilities) {
        const baseSchema = [];
        switch (categorySlug) {
            case 'text-to-image':
                return this.buildTextToImageSchema(capabilities);
            case 'image-to-image':
                return this.buildImageToImageSchema(capabilities);
            case 'text-to-video':
                return this.buildTextToVideoSchema(capabilities);
            case 'image-to-video':
                return this.buildImageToVideoSchema(capabilities);
            case 'audio-to-video':
                return this.buildAudioToVideoSchema(capabilities);
            case 'storyboard-to-video':
                return this.buildStoryboardToVideoSchema(capabilities);
            case 'text-to-music':
                return this.buildTextToMusicSchema(capabilities);
            case 'speech-to-text':
                return this.buildSpeechToTextSchema(capabilities);
            case 'text-to-speech':
                return this.buildTextToSpeechSchema(capabilities);
            case 'text-to-speech-multi':
                return this.buildTextToSpeechMultiSchema(capabilities);
            default:
                return baseSchema;
        }
    }
    buildTextToImageSchema(capabilities) {
        const schema = [
            {
                key: 'prompt',
                label: 'Deskripsi Gambar',
                type: 'textarea',
                required: true,
                placeholder: 'Contoh: Kucing cyberpunk neon di kota futuristik...',
            },
        ];
        if (capabilities.supports_negative_prompt) {
            schema.push({
                key: 'negativePrompt',
                label: 'Negative Prompt',
                type: 'textarea',
                required: false,
                placeholder: 'Apa yang tidak ingin muncul dalam gambar...',
            });
        }
        if (capabilities.ratios && capabilities.ratios.length > 0) {
            schema.push({
                key: 'aspectRatio',
                label: 'Rasio Aspek',
                type: 'select',
                required: true,
                options: capabilities.ratios.map((ratio) => ({
                    label: this.formatRatioLabel(ratio),
                    value: ratio,
                })),
                defaultValue: capabilities.ratios[0],
            });
        }
        if (capabilities.resolutions && capabilities.resolutions.length > 0) {
            schema.push({
                key: 'resolution',
                label: 'Resolusi',
                type: 'select',
                required: false,
                options: capabilities.resolutions.map((res) => ({
                    label: res,
                    value: res,
                })),
            });
        }
        schema.push({
            key: 'seed',
            label: 'Seed (Optional)',
            type: 'number',
            required: false,
            placeholder: 'Random seed untuk reproduksi hasil',
        }, {
            key: 'numberOfGenerations',
            label: 'Jumlah Generasi',
            type: 'number',
            required: false,
            defaultValue: 1,
            min: 1,
            max: capabilities.max_generations || 10,
        }, {
            key: 'isPublic',
            label: 'Publik',
            type: 'toggle',
            required: false,
            defaultValue: false,
        });
        return schema;
    }
    buildImageToImageSchema(capabilities) {
        const schema = [
            {
                key: 'uploadedImages',
                label: 'Upload Gambar',
                type: 'file',
                required: true,
                accept: 'image/*',
                multiple: true,
            },
            {
                key: 'prompt',
                label: 'Deskripsi Perubahan',
                type: 'textarea',
                required: true,
                placeholder: 'Jelaskan perubahan yang diinginkan...',
            },
            {
                key: 'strength',
                label: 'Tingkat Pengaruh',
                type: 'number',
                required: false,
                defaultValue: 0.8,
                min: 0,
                max: 1,
            },
        ];
        if (capabilities.ratios && capabilities.ratios.length > 0) {
            schema.push({
                key: 'aspectRatio',
                label: 'Rasio Aspek',
                type: 'select',
                required: false,
                options: capabilities.ratios.map((ratio) => ({
                    label: this.formatRatioLabel(ratio),
                    value: ratio,
                })),
            });
        }
        schema.push({
            key: 'isPublic',
            label: 'Publik',
            type: 'toggle',
            required: false,
            defaultValue: false,
        });
        return schema;
    }
    buildTextToVideoSchema(capabilities) {
        const schema = [
            {
                key: 'prompt',
                label: 'Deskripsi Video',
                type: 'textarea',
                required: true,
                placeholder: 'Jelaskan video yang ingin dibuat...',
            },
        ];
        if (capabilities.durations && capabilities.durations.length > 0) {
            schema.push({
                key: 'duration',
                label: 'Durasi (detik)',
                type: 'select',
                required: true,
                options: capabilities.durations.map((dur) => ({
                    label: `${dur} detik`,
                    value: dur,
                })),
                defaultValue: capabilities.durations[0],
            });
        }
        if (capabilities.ratios && capabilities.ratios.length > 0) {
            schema.push({
                key: 'aspectRatio',
                label: 'Rasio Aspek',
                type: 'select',
                required: true,
                options: capabilities.ratios.map((ratio) => ({
                    label: this.formatRatioLabel(ratio),
                    value: ratio,
                })),
            });
        }
        schema.push({
            key: 'isPublic',
            label: 'Publik',
            type: 'toggle',
            required: false,
            defaultValue: false,
        });
        return schema;
    }
    buildImageToVideoSchema(capabilities) {
        return [
            {
                key: 'uploadedImages',
                label: 'Upload Gambar',
                type: 'file',
                required: true,
                accept: 'image/*',
                multiple: false,
            },
            {
                key: 'prompt',
                label: 'Deskripsi Animasi',
                type: 'textarea',
                required: false,
                placeholder: 'Jelaskan animasi yang diinginkan...',
            },
            {
                key: 'duration',
                label: 'Durasi',
                type: 'select',
                required: true,
                options: (capabilities.durations || [5, 10]).map((dur) => ({
                    label: `${dur} detik`,
                    value: dur,
                })),
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildAudioToVideoSchema(capabilities) {
        return [
            {
                key: 'uploadedAudio',
                label: 'Upload Audio',
                type: 'file',
                required: true,
                accept: 'audio/*',
                multiple: false,
            },
            {
                key: 'uploadedImage',
                label: 'Upload Gambar Anchor (Optional)',
                type: 'file',
                required: false,
                accept: 'image/*',
                multiple: false,
            },
            {
                key: 'prompt',
                label: 'Deskripsi',
                type: 'textarea',
                required: false,
                placeholder: 'Deskripsi tambahan...',
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildStoryboardToVideoSchema(capabilities) {
        return [
            {
                key: 'scenes',
                label: 'Scene',
                type: 'array',
                required: true,
                subSchema: [
                    {
                        key: 'sceneImage',
                        label: 'Gambar Scene',
                        type: 'file',
                        required: true,
                        accept: 'image/*',
                    },
                    {
                        key: 'prompt',
                        label: 'Deskripsi Scene',
                        type: 'textarea',
                        required: true,
                    },
                    {
                        key: 'duration',
                        label: 'Durasi (detik)',
                        type: 'number',
                        required: true,
                        min: 1,
                        max: 10,
                    },
                ],
            },
            {
                key: 'aspectRatio',
                label: 'Rasio Aspek Global',
                type: 'select',
                required: true,
                options: (capabilities.ratios || ['16:9', '9:16']).map((ratio) => ({
                    label: this.formatRatioLabel(ratio),
                    value: ratio,
                })),
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildTextToMusicSchema(capabilities) {
        return [
            {
                key: 'title',
                label: 'Judul',
                type: 'text',
                required: true,
                placeholder: 'Judul musik...',
            },
            {
                key: 'musicStyle',
                label: 'Genre',
                type: 'select',
                required: true,
                options: (capabilities.genres || ['Pop', 'Rock', 'Jazz', 'Classical']).map((genre) => ({
                    label: genre,
                    value: genre,
                })),
            },
            {
                key: 'isInstrumental',
                label: 'Instrumental',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
            {
                key: 'lyrics',
                label: 'Lirik',
                type: 'textarea',
                required: false,
                placeholder: 'Masukkan lirik (jika tidak instrumental)...',
            },
            {
                key: 'vocalGender',
                label: 'Jenis Vokal',
                type: 'select',
                required: false,
                options: [
                    { label: 'Pria', value: 'male' },
                    { label: 'Wanita', value: 'female' },
                ],
            },
            {
                key: 'duration',
                label: 'Durasi (detik)',
                type: 'number',
                required: false,
                defaultValue: 30,
                min: 10,
                max: 180,
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildSpeechToTextSchema(capabilities) {
        return [
            {
                key: 'uploadedAudio',
                label: 'Upload Audio',
                type: 'file',
                required: true,
                accept: 'audio/*',
                multiple: false,
            },
            {
                key: 'language',
                label: 'Bahasa',
                type: 'select',
                required: true,
                options: (capabilities.languages || ['en', 'id']).map((lang) => ({
                    label: this.formatLanguageLabel(lang),
                    value: lang,
                })),
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildTextToSpeechSchema(capabilities) {
        return [
            {
                key: 'text',
                label: 'Teks',
                type: 'textarea',
                required: true,
                placeholder: 'Masukkan teks yang akan dikonversi ke suara...',
            },
            {
                key: 'voiceId',
                label: 'Suara',
                type: 'select',
                required: true,
                options: (capabilities.voices || []).map((voice) => ({
                    label: voice.name || voice.id,
                    value: voice.id,
                })),
            },
            {
                key: 'style',
                label: 'Gaya/Emosi',
                type: 'select',
                required: false,
                options: (capabilities.styles || ['neutral', 'happy', 'sad']).map((style) => ({
                    label: this.formatStyleLabel(style),
                    value: style,
                })),
            },
            {
                key: 'language',
                label: 'Bahasa',
                type: 'select',
                required: true,
                options: (capabilities.languages || ['en', 'id']).map((lang) => ({
                    label: this.formatLanguageLabel(lang),
                    value: lang,
                })),
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    buildTextToSpeechMultiSchema(capabilities) {
        return [
            {
                key: 'speakers',
                label: 'Pembicara',
                type: 'array',
                required: true,
                subSchema: [
                    {
                        key: 'text',
                        label: 'Teks',
                        type: 'textarea',
                        required: true,
                    },
                    {
                        key: 'voiceId',
                        label: 'Suara',
                        type: 'select',
                        required: true,
                        options: (capabilities.voices || []).map((voice) => ({
                            label: voice.name || voice.id,
                            value: voice.id,
                        })),
                    },
                ],
            },
            {
                key: 'language',
                label: 'Bahasa',
                type: 'select',
                required: true,
                options: (capabilities.languages || ['en', 'id']).map((lang) => ({
                    label: this.formatLanguageLabel(lang),
                    value: lang,
                })),
            },
            {
                key: 'isPublic',
                label: 'Publik',
                type: 'toggle',
                required: false,
                defaultValue: false,
            },
        ];
    }
    formatRatioLabel(ratio) {
        const labels = {
            '1:1': 'Persegi (1:1)',
            '16:9': 'Landscape (16:9)',
            '9:16': 'Portrait (9:16)',
            '4:3': 'Standard (4:3)',
            '3:4': 'Portrait Standard (3:4)',
            '21:9': 'Ultra-wide (21:9)',
        };
        return labels[ratio] || ratio;
    }
    formatLanguageLabel(lang) {
        const labels = {
            en: 'English',
            id: 'Indonesian',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            ja: 'Japanese',
            ko: 'Korean',
            zh: 'Chinese',
        };
        return labels[lang] || lang;
    }
    formatStyleLabel(style) {
        const labels = {
            neutral: 'Netral',
            happy: 'Gembira',
            sad: 'Sedih',
            angry: 'Marah',
            excited: 'Bersemangat',
        };
        return labels[style] || style;
    }
};
exports.FormSchemaService = FormSchemaService;
exports.FormSchemaService = FormSchemaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormSchemaService);
//# sourceMappingURL=form-schema.service.js.map