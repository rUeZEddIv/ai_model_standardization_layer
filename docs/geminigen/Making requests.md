## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

## Introduction

# Making requests

Make your first request to the GeminiGen.AI API and get started with the powerful AI generation features.

After setting up your account and obtaining your API key, setup webhooks, you can start making requests to the GeminiGen.AI API. This guide will walk you through the process of making your first request and provide examples of how to use the API to generate speech from text, create images, videos, and more.

terminal py ts

```bash
curl -X POST https://api.geminigen.ai/uapi/v1/text-to-speech \
-H "Content-Type: application/json" \
-H "x-api-key: <your api key>" \
-d '{
  "model": "tts-1",
  "voice_id": "0A001",
  "speed": 1,
  "input": "Hello, my name is GeminiGen.AI. I am a text-to-speech model."
}'
```

You can find the voice IDs in Voice Library page.

---

Webhooks
Receive notifications from your API requests in real-time with webhooks.

Errors
What happens when things go wrong? Learn how to handle errors and troubleshoot issues with the TTS API.

---


## Page 2

Privacy Terms

Copyright © 2025, GeminiGen.AI