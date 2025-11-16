# AI Model Standardization Layer - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend / Client                          │
│                    (React, Vue, Mobile App, etc.)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS Requests
                             │ (Standardized JSON Format)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         NestJS API Gateway                          │
│                         (Port 3000)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │                    Controllers Layer                       │    │
│  ├───────────────────────────────────────────────────────────┤    │
│  │  • ModelsController      (GET /api/v1/models)            │    │
│  │  • GenerationController  (POST /api/v1/generate/*)       │    │
│  │  • WebhookController     (POST /api/v1/webhooks/*)       │    │
│  └───────────────────────────────────────────────────────────┘    │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │                     Services Layer                         │    │
│  ├───────────────────────────────────────────────────────────┤    │
│  │  • ModelsService        (Discovery & Capabilities)        │    │
│  │  • TextToImageService   (Generation Orchestration)        │    │
│  │  • WebhookService       (Callback Processing)             │    │
│  └───────────────────────────────────────────────────────────┘    │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │           Adapter/Strategy Pattern Layer                  │    │
│  ├───────────────────────────────────────────────────────────┤    │
│  │  ┌─────────────────┐    ┌─────────────────┐              │    │
│  │  │  KieAdapter     │    │ GeminigenAdapter│              │    │
│  │  ├─────────────────┤    ├─────────────────┤              │    │
│  │  │ • generate()    │    │ • generate()    │   ... more   │    │
│  │  │ • webhook()     │    │ • webhook()     │   adapters   │    │
│  │  │ • transformTo() │    │ • transformTo() │              │    │
│  │  │ • transformFrom │    │ • transformFrom │              │    │
│  │  └─────────────────┘    └─────────────────┘              │    │
│  └───────────────────────────────────────────────────────────┘    │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│   PostgreSQL Database   │    │   External AI Providers │
│   (Port 5432)          │    │                         │
├─────────────────────────┤    ├─────────────────────────┤
│ • users                 │    │ • Kie.ai                │
│ • ai_providers          │    │ • Geminigen.ai          │
│ • ai_models             │    │ • OpenAI                │
│ • user_provider_creds   │    │ • Anthropic             │
│ • generation_jobs       │    │ • ... more providers    │
│ • generated_outputs     │    └─────────────────────────┘
└─────────────────────────┘                │
              ▲                             │
              │                             │
              │      Webhook Callbacks      │
              └─────────────────────────────┘
```

## Request Flow Example: Text-to-Image Generation

### Synchronous Flow (Immediate Response)
```
1. Client → POST /api/v1/generate/text-to-image
   Headers: { x-user-id: "uuid" }
   Body: { aiModelId, prompt, aspectRatio, resolution, ... }

2. GenerationController → TextToImageService.generate()

3. TextToImageService:
   - Validates aiModelId exists
   - Retrieves user's API credentials for provider
   - Selects appropriate adapter (Kie/Geminigen/etc)
   - Creates GenerationJob record (status: PENDING)

4. Adapter (e.g., KieAdapter):
   - Transforms standard DTO → Kie.ai format
   - Calls Kie.ai API
   - Receives provider response
   - Transforms Kie.ai format → standard format

5. TextToImageService:
   - Updates GenerationJob (status: PROCESSING or COMPLETED)
   - Returns to client

6. Client ← Response:
   {
     jobId: "uuid",
     status: "PENDING" | "COMPLETED",
     providerJobId: "kie-123",
     outputs: [...] (if completed)
   }
```

### Asynchronous Flow (Webhook)
```
7. Provider (Kie.ai) processes job asynchronously

8. Provider → POST /api/v1/webhooks/provider-callback/{jobId}
   Body: { job_id, status: "completed", results: [...] }

9. WebhookController → WebhookService.handleProviderCallback()

10. WebhookService:
    - Finds GenerationJob by jobId
    - Transforms provider webhook payload → standard format
    - Updates job status to COMPLETED
    - Creates GeneratedOutput records
    - (Optional) Notifies client via WebSocket

11. Client can poll GET /api/v1/generate/jobs/{jobId} for status
```

## Dynamic Capability Discovery Flow

```
1. Client loads "Text to Image" form

2. Client → GET /api/v1/models?category=TEXT_TO_IMAGE
   ← Returns: [
       { id: "model-1", name: "Kie Image Gen", provider: "Kie.ai" },
       { id: "model-2", name: "Geminigen SDXL", provider: "Geminigen.ai" }
     ]

3. User selects model-1 ("Kie Image Gen")

4. Client → GET /api/v1/models/model-1/capabilities
   ← Returns: {
       aspectRatios: ["1:1", "16:9", "4:3", "3:4", "9:16"],
       resolutions: ["1024x1024", "1920x1080", "1080x1920"],
       maxGenerations: 4
     }

5. Frontend dynamically populates form dropdowns with these values

6. User submits form with valid values only
```

## Database Entity Relationships

```
users (1) ──────< user_provider_credentials >────── (1) ai_providers
  │                                                        │
  │                                                        │
  │                                                        │
  │                                                   (1) ─┴─< ai_models
  │                                                              │
  │                                                              │
  └──────< generation_jobs >──────────────────────────────────< ┘
              │
              │
              └──────< generated_outputs
```

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL 14+
- **Validation**: class-validator, class-transformer
- **HTTP Client**: Axios
- **Documentation**: Swagger/OpenAPI

### Key Design Patterns
- **Strategy/Adapter Pattern**: Provider abstraction
- **Repository Pattern**: Database access
- **Dependency Injection**: NestJS built-in DI
- **DTO Pattern**: Request/response validation

### Database Features
- **JSONB**: Dynamic capabilities storage
- **UUIDs**: Primary keys
- **Enums**: Type safety for categories/statuses
- **Indexes**: Performance optimization
- **Foreign Keys**: Referential integrity

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API can be load-balanced
2. **Caching**: Add Redis for model capabilities and frequently accessed data
3. **Queue System**: Add Bull/RabbitMQ for job queue management
4. **CDN**: Store generated outputs in S3/CloudFront
5. **Database**: Read replicas for query-heavy operations
6. **Rate Limiting**: Protect against abuse
7. **Circuit Breaker**: Handle provider API failures gracefully
