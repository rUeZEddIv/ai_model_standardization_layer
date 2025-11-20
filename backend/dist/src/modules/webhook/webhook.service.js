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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const adapter_factory_1 = require("../../adapters/adapter.factory");
let WebhookService = WebhookService_1 = class WebhookService {
    prisma;
    adapterFactory;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(prisma, adapterFactory) {
        this.prisma = prisma;
        this.adapterFactory = adapterFactory;
    }
    async handleCallback(payload, providerSlug) {
        this.logger.log(`Received webhook callback: ${JSON.stringify(payload)}`);
        const detectedProvider = providerSlug || this.detectProvider(payload);
        if (!detectedProvider) {
            this.logger.error('Could not detect provider from webhook payload');
            throw new Error('Could not detect provider');
        }
        try {
            const adapter = this.adapterFactory.getAdapter(detectedProvider);
            const webhookResponse = await adapter.handleWebhook(payload);
            const transaction = await this.prisma.transaction.findFirst({
                where: {
                    providerResponse: {
                        path: ['data', 'taskId'],
                        equals: webhookResponse.taskId,
                    },
                },
            });
            if (!transaction) {
                const allTransactions = await this.prisma.transaction.findMany({
                    where: {
                        status: {
                            in: ['PENDING', 'PROCESSING'],
                        },
                    },
                });
                const foundTransaction = allTransactions.find(t => {
                    const response = t.providerResponse;
                    return response?.data?.taskId === webhookResponse.taskId ||
                        response?.taskId === webhookResponse.taskId;
                });
                if (!foundTransaction) {
                    this.logger.warn(`Transaction not found for taskId: ${webhookResponse.taskId}`);
                    throw new common_1.NotFoundException(`Transaction not found for taskId: ${webhookResponse.taskId}`);
                }
                await this.prisma.transaction.update({
                    where: { id: foundTransaction.id },
                    data: {
                        status: webhookResponse.status,
                        outputResult: webhookResponse.outputResult,
                        errorMessage: webhookResponse.errorMessage,
                    },
                });
                this.logger.log(`Transaction ${foundTransaction.id} updated to status: ${webhookResponse.status}`);
                return { message: 'Webhook processed successfully' };
            }
            await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: webhookResponse.status,
                    outputResult: webhookResponse.outputResult,
                    errorMessage: webhookResponse.errorMessage,
                },
            });
            this.logger.log(`Transaction ${transaction.id} updated to status: ${webhookResponse.status}`);
            return { message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error(`Error processing webhook: ${error.message}`);
            throw error;
        }
    }
    detectProvider(payload) {
        if (payload.code !== undefined && payload.data?.taskId) {
            return 'kie';
        }
        if (payload.uuid && payload.status !== undefined) {
            return 'geminigen';
        }
        if (payload.taskId || payload.task_id) {
            if (payload.msg || payload.code) {
                return 'kie';
            }
            if (payload.generate_result || payload.used_credit !== undefined) {
                return 'geminigen';
            }
        }
        return null;
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        adapter_factory_1.AdapterFactory])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map