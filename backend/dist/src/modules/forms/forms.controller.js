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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const form_schema_service_1 = require("./form-schema.service");
let FormsController = class FormsController {
    formSchemaService;
    constructor(formSchemaService) {
        this.formSchemaService = formSchemaService;
    }
    async getFormSchema(categorySlug, aiModelId) {
        return this.formSchemaService.getFormSchema(categorySlug, aiModelId);
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Get)(':categorySlug/schema'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dynamic form schema for a category',
        description: 'Returns form schema based on category and optional AI model. If no model is specified, returns available models.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'categorySlug',
        description: 'Category slug (e.g., text-to-image, image-to-image)',
        example: 'text-to-image',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'aiModelId',
        description: 'Optional AI Model ID to get specific form schema',
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Form schema retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Category or model not found',
    }),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Query)('aiModelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getFormSchema", null);
exports.FormsController = FormsController = __decorate([
    (0, swagger_1.ApiTags)('Forms'),
    (0, common_1.Controller)('api/v1/forms'),
    __metadata("design:paramtypes", [form_schema_service_1.FormSchemaService])
], FormsController);
//# sourceMappingURL=forms.controller.js.map