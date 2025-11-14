#!/bin/bash

# AI Model Standardization Layer - API Usage Examples
# Make sure the application is running: npm run start:dev

BASE_URL="http://localhost:3000/api/v1"

echo "========================================="
echo "AI Model Standardization Layer Examples"
echo "========================================="
echo ""

# Check if server is running
echo "1. Checking server health..."
curl -s "$BASE_URL/../" | head -1
echo ""
echo ""

# List providers
echo "2. Listing providers..."
curl -s "$BASE_URL/providers" | jq -r '.[] | "- \(.name) (\(.slug))"'
echo ""

# List models
echo "3. Listing available models..."
curl -s "$BASE_URL/models" | jq -r '.[] | "- \(.name) - Category: \(.category)"'
echo ""

# Get first model ID for testing
MODEL_ID=$(curl -s "$BASE_URL/models" | jq -r '.[0].id')
echo "Using model ID: $MODEL_ID"
echo ""

# Example: Text to Image Generation
echo "4. Creating Text-to-Image job..."
TEXT_TO_IMAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/generation/text-to-image" \
  -H "Content-Type: application/json" \
  -d "{
    \"aiModelId\": \"$MODEL_ID\",
    \"prompt\": \"A serene mountain landscape at sunset with a lake reflecting the orange sky\",
    \"aspectRatio\": \"16:9\",
    \"numberOfGenerations\": 1
  }")

JOB_ID=$(echo $TEXT_TO_IMAGE_RESPONSE | jq -r '.id')
echo "Job created: $JOB_ID"
echo "Status: $(echo $TEXT_TO_IMAGE_RESPONSE | jq -r '.status')"
echo ""

# Check job status
echo "5. Checking job status..."
curl -s "$BASE_URL/generation/job/$JOB_ID" | jq '.'
echo ""

# List recent jobs
echo "6. Listing recent jobs..."
curl -s "$BASE_URL/jobs?limit=5" | jq -r '.[] | "Job \(.id): \(.category) - \(.status)"'
echo ""

echo "========================================="
echo "For more examples, see the Swagger docs:"
echo "http://localhost:3000/api"
echo "========================================="
