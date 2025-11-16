# AI Model Standardization Layer

A comprehensive platform for AI content generation that provides a unified API interface for multiple AI providers (KIE.AI and GeminiGen.AI).

## 🚀 Quick Start

### Backend API

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with API keys and database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Access the API at:
- **API Base URL**: `http://localhost:3000/api/v1`
- **Swagger Documentation**: `http://localhost:3000/api/docs`

## 📁 Repository Structure

```
ai_model_standardization_layer/
├── docs/                      # API documentation for providers
│   ├── kie/                   # KIE.AI API documentation
│   │   ├── Sora 2/
│   │   ├── Bytedance API/
│   │   ├── Kling API/
│   │   ├── Runway API/
│   │   ├── Suno API/
│   │   └── ...
│   └── geminigen/             # GeminiGen.AI API documentation
│       ├── Authentication.md
│       ├── Image Generation.md
│       ├── Video Generation.md
│       ├── Text to Speech.md
│       └── ...
└── backend/                   # NestJS Backend Implementation
    ├── src/
    │   ├── common/           # Shared utilities and DTOs
    │   ├── config/           # Configuration management
    │   ├── forms/            # Dynamic form schema endpoints
    │   ├── generations/      # Generation task management
    │   ├── prisma/           # Database service
    │   ├── providers/        # AI provider adapters
    │   └── webhooks/         # Webhook handlers
    ├── prisma/
    │   ├── schema.prisma     # Database schema
    │   └── seed/             # Database seed data
    └── README.md             # Backend documentation
```

## 🎯 Features

### 11 Content Generation Categories

1. **Text to Image** - Generate images from text descriptions
2. **Image to Image** - Transform or edit existing images  
3. **Text to Video** - Generate videos from text descriptions
4. **Image to Video** - Create videos from static images
5. **Audio to Video** - Generate videos with audio input
6. **Storyboard to Video** - Multi-scene video creation
7. **Text to Music** - Generate music from descriptions
8. **Speech to Text** - Audio transcription
9. **Text to Speech (Single)** - Single voice synthesis
10. **Text to Speech (Multiple)** - Multi-speaker dialogue
11. **Document to Speech** - Document narration

### AI Provider Integration

#### KIE.AI
- **Models**: Qwen, Grok, Flux, Sora, Bytedance, Kling, Wan, Runway, Ideogram, Suno
- **Categories**: Image, Video, Music generation

#### GeminiGen.AI
- **Models**: Imagen, Veo, TTS Flash/Pro
- **Categories**: Image, Video, Speech generation

### Key Capabilities

✅ **Unified API** - Single interface for multiple AI providers  
✅ **Dynamic Forms** - Auto-generated forms based on selected AI model  
✅ **Field Mapping** - Automatic translation between standard and provider-specific fields  
✅ **Async Processing** - Task-based generation with status polling  
✅ **Webhook Support** - Real-time callbacks when generation completes  
✅ **Type Safety** - Full TypeScript implementation with Prisma ORM  
✅ **API Documentation** - Interactive Swagger/OpenAPI docs  

## 🏗️ Architecture

```
Frontend App
     │
     ▼
NestJS API (Backend)
     │
     ├─→ KIE.AI Adapter ──→ KIE.AI API
     │
     └─→ GeminiGen Adapter ──→ GeminiGen.AI API
     │
     ▼
PostgreSQL Database
```

### Technology Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Docs**: Swagger/OpenAPI
- **Validation**: class-validator

## 📖 Documentation

### Provider Documentation
- **KIE.AI**: See `/docs/kie/` for detailed API documentation
- **GeminiGen.AI**: See `/docs/geminigen/` for API documentation

### Implementation Guide
- **Backend**: See `/backend/README.md` for setup instructions
- **Complete Guide**: See `/backend/IMPLEMENTATION_GUIDE.md` for detailed architecture

## 🔧 API Examples

### Create Generation Task

```bash
curl -X POST http://localhost:3000/api/v1/generations \
  -H "Content-Type: application/json" \
  -d '{
    "category": "text-to-image",
    "aiModelId": "uuid-of-qwen-model",
    "input": {
      "prompt": "A beautiful sunset over mountains",
      "aspectRatio": "16:9",
      "numberOfGenerations": 1,
      "isPublic": false
    },
    "webhookUrl": "https://your-app.com/webhook"
  }'
```

### Get Task Status

```bash
curl http://localhost:3000/api/v1/generations/{taskId}
```

### Get Form Schema

```bash
curl http://localhost:3000/api/v1/forms/{categoryId}/schema?modelId={modelId}
```

## 🗄️ Database Schema

The platform uses 8 main tables:

1. **ai_providers** - Provider definitions (KIE.AI, GeminiGen.AI)
2. **ai_models** - Available AI models per provider
3. **form_categories** - 11 generation categories
4. **model_field_mappings** - Dynamic form fields per model
5. **generation_tasks** - User generation requests
6. **generation_results** - Generated content metadata
7. **api_keys** - Provider API credentials
8. **webhook_logs** - Webhook event tracking

## 🔐 Security

- API keys encrypted in database
- Input validation with class-validator
- SQL injection prevention via Prisma ORM
- Webhook signature verification (configurable)
- Environment-based configuration

## 🚦 Development Workflow

1. **Setup**: Install dependencies and configure environment
2. **Database**: Run migrations and seed initial data
3. **Development**: Use hot-reload dev server
4. **Testing**: Run unit and e2e tests
5. **Build**: Compile for production
6. **Deploy**: Deploy with your preferred hosting

## 📝 Environment Variables

Required:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_db
KIE_API_KEYS=key1,key2,key3
GEMINIGEN_API_KEYS=key1,key2,key3
```

Optional:
```env
API_PORT=3000
JWT_SECRET=your-secret
WEBHOOK_SECRET=webhook-secret
```

## 🤝 Contributing

This is a standardization layer project. To add new providers:

1. Create adapter in `/backend/src/providers/adapters/`
2. Implement `AIProviderAdapter` interface
3. Add provider and models to database seed
4. Update field mappings for new models

## 📄 License

UNLICENSED

## 🆘 Support

For detailed implementation guidance:
- Backend Setup: `/backend/README.md`
- Complete Guide: `/backend/IMPLEMENTATION_GUIDE.md`
- API Documentation: `http://localhost:3000/api/docs` (when running)

---

**Built with NestJS, Prisma, and TypeScript** 🚀
