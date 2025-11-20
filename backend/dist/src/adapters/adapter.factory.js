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
exports.AdapterFactory = void 0;
const common_1 = require("@nestjs/common");
const kie_adapter_1 = require("./kie.adapter");
const geminigen_adapter_1 = require("./geminigen.adapter");
let AdapterFactory = class AdapterFactory {
    kieAdapter;
    geminiGenAdapter;
    constructor(kieAdapter, geminiGenAdapter) {
        this.kieAdapter = kieAdapter;
        this.geminiGenAdapter = geminiGenAdapter;
    }
    getAdapter(providerSlug) {
        switch (providerSlug.toLowerCase()) {
            case 'kie':
            case 'kie.ai':
                return this.kieAdapter;
            case 'geminigen':
            case 'geminigen.ai':
                return this.geminiGenAdapter;
            default:
                throw new Error(`Unsupported provider: ${providerSlug}`);
        }
    }
};
exports.AdapterFactory = AdapterFactory;
exports.AdapterFactory = AdapterFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kie_adapter_1.KieAdapter,
        geminigen_adapter_1.GeminiGenAdapter])
], AdapterFactory);
//# sourceMappingURL=adapter.factory.js.map