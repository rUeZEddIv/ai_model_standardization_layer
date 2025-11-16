#!/bin/bash

# AI Content Generation Platform - API Demo Script
# This script demonstrates the API workflow

API_BASE="http://localhost:3000/api/v1"

echo "=================================="
echo "AI Content Generation Platform Demo"
echo "=================================="
echo ""

# Check if server is running
echo "1. Checking if server is running..."
if curl -s "${API_BASE}/forms/categories" > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Start it with: npm run start:dev"
    exit 1
fi
echo ""

# List categories
echo "2. Fetching available categories..."
curl -s "${API_BASE}/forms/categories" | jq '.data[] | {name: .name, slug: .slug}'
echo ""

# List models
echo "3. Fetching available AI models..."
curl -s "${API_BASE}/forms/models" | jq '.data[] | {name: .name, provider: .provider, category: .category}'
echo ""

# Get form schema for text-to-image
echo "4. Getting form schema for a specific model..."
CATEGORY_ID=$(curl -s "${API_BASE}/forms/categories" | jq -r '.data[] | select(.slug == "text-to-image") | .id')
MODEL_ID=$(curl -s "${API_BASE}/forms/models?categoryId=${CATEGORY_ID}" | jq -r '.data[0].id')

if [ -n "$MODEL_ID" ]; then
    echo "Fetching schema for model: $MODEL_ID"
    curl -s "${API_BASE}/forms/${CATEGORY_ID}/schema?modelId=${MODEL_ID}" | jq '.data | {category: .category, model: .model.name, fields: .fields | length}'
    echo ""
else
    echo "⚠️  No models found for text-to-image category"
    echo ""
fi

# Create a generation task (example)
echo "5. Example: Creating a generation task..."
echo "(This is a dry run - actual API call would be:)"
echo ""
cat <<'EOF'
curl -X POST http://localhost:3000/api/v1/generations \
  -H "Content-Type: application/json" \
  -d '{
    "category": "text-to-image",
    "aiModelId": "YOUR_MODEL_ID_HERE",
    "input": {
      "prompt": "A beautiful sunset over mountains with vibrant colors",
      "aspectRatio": "16:9",
      "numberOfGenerations": 1,
      "isPublic": false
    },
    "webhookUrl": "https://your-app.com/webhook"
  }'
EOF
echo ""
echo ""

# Show webhook endpoints
echo "6. Available webhook endpoints:"
echo "   - POST ${API_BASE}/webhooks/kie"
echo "   - POST ${API_BASE}/webhooks/geminigen"
echo "   - POST ${API_BASE}/webhooks (generic)"
echo ""

echo "=================================="
echo "Demo completed!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Configure API keys in .env file"
echo "2. Run database migrations: npm run prisma:migrate"
echo "3. Seed database: npm run prisma:seed"
echo "4. Start server: npm run start:dev"
echo "5. Visit Swagger docs: http://localhost:3000/api/docs"
echo ""
