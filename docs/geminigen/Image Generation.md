## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

Resources

# Image Generation

Generate stunning, high-quality images from text prompts using advanced AI models.

The GeminiGen.AI Image Generation API allows you to create stunning, high-quality images from text prompts using state-of-the-art AI models. You can use this API to generate artwork, marketing materials, product mockups, or any visual content you can imagine.

## Generate Image

POST https://api.geminigen.ai/uapi/v1/generate_image

This endpoint allows you to generate images from text prompts. You can customize the model, aspect ratio, style, and various other parameters to create the perfect image for your needs.

## Example Request

```bash
terminal py js

curl -X POST https://api.geminigen.ai/uapi/v1/generate_image \
  -H "Content-Type: multipart/form-data" \
  -H "x-api-key: <your api key>" \
  --form "prompt=A beautiful sunset over mountains with vibrant colors" \
  --form "model=imagen-4" \
  --form "aspect_ratio=16:9" \
  --form "style=Photorealistic" \
  --form "service_mode=unstable"
```

## Request Parameters

**prompt** string required

The text description of the image you want to generate. Be as descriptive as possible for better results.

**model** string required

The AI model to use for image generation. Available models include:

*   imagen-flash - Gemini 2.5 Flash - Fast generation with good quality
*   imagen-4-fast - Imagen 4 Fast - Quick generation with high quality
*   imagen-4 - Imagen 4 - Standard high-quality generation
*   imagen-4-ultra - Imagen 4 Ultra - Premium quality with best results

**aspect_ratio** string

The aspect ratio of the generated image. Common options:

*   1:1 - Square (default)
*   16:9 - Widescreen
*   9:16 - Portrait
*   4:3 - Standard
*   3:4 - Portrait standard

**style** string

The artistic style to apply to the image:

*   None - No specific style applied
*   3D Render - Three-dimensional rendered style
*   Acrylic - Acrylic painting style
*   Anime General - General anime/manga style
*   Creative - Creative and artistic interpretation
*   Dynamic - Dynamic and energetic style
*   Fashion - Fashion photography style

---


## Page 2

* Game Concept - Video game concept art style
* Graphic Design 3D - 3D graphic design style
* Illustration - Digital illustration style
* Photorealistic - Realistic photography style
* Portrait - Portrait photography style
* Portrait Cinematic - Cinematic portrait style
* Portrait Fashion - Fashion portrait style
* Ray Traced - Ray-traced rendering style
* Stock Photo - Stock photography style
* Watercolor - Watercolor painting style

files array

Optional reference images to guide the generation process. Upload image files to use as style or content references.

service_mode string

The service mode for image generation. This parameter controls processing priority and performance settings:

* unstable - Reliable but may be slower at peak time (promotional pricing)
* stable - Smooth, priority performance, no delays (original pricing)

## Example Response

Response

```json
{
  "id": 12345,
  "uuid": "img_abc123def456",
  "user_id": 789,
  "model_name": "imagen-4",
  "input_text": "A beautiful sunset over mountains with vibrant colors",
  "negative_prompt": "",
  "generate_result": "https://cdn.geminigen.ai/images/img_abc123def456.jpg",
  "input_file_path": "",
  "type": "image_generation",
  "used_credit": 10,
  "status": 2,
  "status_desc": "completed",
  "status_percentage": 100,
  "error_code": "",
  "error_message": "",
  "rating": "",
  "rating_content": "",
  "custom_prompt": "",
  "created_at": "2025-07-21T13:26:53.076Z",
  "updated_at": "2025-07-21T13:26:53.076Z",
  "file_size": 2048576,
  "expired_at": "2025-08-21T13:26:53.076Z",
  "inference_type": "text_to_image",
  "name": "Beautiful Sunset Mountains",
  "created_by": "user_789",
  "thumbnail_small": "https://cdn.geminigen.ai/thumbnails/img_abc123def456_small.jpg"
}
```

## Response Fields

id - Unique identifier for the generation request
uuid - Universal unique identifier for the generated image
generate_result - URL to the generated image
status - Generation status (1: processing, 2: completed, 3: failed)
status_percentage - Progress percentage (0-100)
used_credit - Credits consumed for this generation
file_size - Size of the generated image in bytes
thumbnail_small - URL to a small thumbnail version

## Status Codes

* 1 - Processing: The image is being generated

---


## Page 3

*   2 - Completed: Image generation successful
*   3 - Failed: Generation failed (check error_message)

## Best Practices

1.  **Detailed Prompts:** Use descriptive, specific prompts for better results
2.  **Style Consistency:** Choose appropriate styles for your use case
3.  **Aspect Ratios:** Select ratios that match your intended use
4.  **Safety Filters:** Use appropriate safety levels for your content
5.  **Credit Management:** Monitor credit usage for cost optimization

## Common Use Cases

*   Marketing Materials: Product images, advertisements, social media content
*   Creative Projects: Artwork, illustrations, concept designs
*   Content Creation: Blog images, thumbnails, visual storytelling
*   Prototyping: UI mockups, design concepts, visual brainstorming
*   Education: Illustrations for learning materials, presentations

---

| Video Generation Sora | Generation History APIs |
| :-------------------- | :----------------------- |
| Generate high-quality videos from text prompts using OpenAI's Sora model. | Retrieve and manage your generation history with detailed information about past AI generations. |

Privacy Terms

Copyright © 2025, GeminiGen.AI