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
exports.GenerateResponseDto = exports.GenerateRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateRequestDto {
    categoryId;
    aiModelId;
    data;
}
exports.GenerateRequestDto = GenerateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID (slug)',
        example: 'text-to-image',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateRequestDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'AI Model ID',
        example: 'uuid-of-model',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateRequestDto.prototype, "aiModelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dynamic data based on form schema',
        example: {
            prompt: 'A beautiful sunset over mountains',
            aspectRatio: '16:9',
            isPublic: false,
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], GenerateRequestDto.prototype, "data", void 0);
class GenerateResponseDto {
    transactionId;
    taskId;
    status;
    message;
}
exports.GenerateResponseDto = GenerateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction ID',
        example: 'uuid-transaction-id',
    }),
    __metadata("design:type", String)
], GenerateResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider task ID',
        example: 'task12345',
    }),
    __metadata("design:type", String)
], GenerateResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the generation request',
        example: 'PENDING',
    }),
    __metadata("design:type", String)
], GenerateResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message',
        example: 'Generation request submitted successfully',
    }),
    __metadata("design:type", String)
], GenerateResponseDto.prototype, "message", void 0);
//# sourceMappingURL=generate-request.dto.js.map