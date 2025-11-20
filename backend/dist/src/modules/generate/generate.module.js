"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateModule = void 0;
const common_1 = require("@nestjs/common");
const generate_controller_1 = require("./generate.controller");
const generate_service_1 = require("./generate.service");
const kie_adapter_1 = require("../../adapters/kie.adapter");
const geminigen_adapter_1 = require("../../adapters/geminigen.adapter");
const adapter_factory_1 = require("../../adapters/adapter.factory");
let GenerateModule = class GenerateModule {
};
exports.GenerateModule = GenerateModule;
exports.GenerateModule = GenerateModule = __decorate([
    (0, common_1.Module)({
        controllers: [generate_controller_1.GenerateController],
        providers: [generate_service_1.GenerateService, kie_adapter_1.KieAdapter, geminigen_adapter_1.GeminiGenAdapter, adapter_factory_1.AdapterFactory],
        exports: [generate_service_1.GenerateService],
    })
], GenerateModule);
//# sourceMappingURL=generate.module.js.map