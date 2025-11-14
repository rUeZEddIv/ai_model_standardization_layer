## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

Resources

# Video Generation

Generate high-quality videos from text prompts using advanced AI models.

The GeminiGen.AI Video Generation API allows you to create high-quality videos from text prompts using state-of-the-art AI models. You can use this API to generate video content, animations, marketing materials, or any visual video content you can imagine.

## Generate Video Veo

POST https://api.geminigen.ai/uapi/v1/video-gen/veo

This endpoint allows you to generate videos from text prompts using the Veo model. You can customize the resolution, duration, aspect ratio, and various other parameters to create the perfect video for your needs.

### Example Request

```bash
curl -X POST https://api.geminigen.ai/uapi/v1/video-gen/veo \
  -H "Content-Type: multipart/form-data" \
  -H "x-api-key: <your api key>" \
  --form "prompt=A serene lake surrounded by mountains at sunset with gentle waves" \
  --form "model=veo-2" \
  --form "resolution=720p" \
  --form "duration=8" \
  --form "aspect_ratio=16:9" \
  --form "service_mode=unstable"
```

### Request Parameters

**prompt** string required

The text description of the video you want to generate. Be as descriptive as possible for better results. Include details about movement, scene composition, and visual elements.

**model** string required

The AI model to use for video generation. Available models include:

*   **veo-3** - Veo 3.1 - Latest high-quality video generation model with enhanced capabilities
*   **veo-3-fast** - Veo 3.1 Fast - Faster version of Veo 3.1 with optimized processing speed
*   **veo-2** - Veo 2 - Advanced video generation model with flexible duration options

**resolution** string

The resolution of the generated video. Available options:

*   **720p** - High definition (1280x720)
*   **1080p** - Full high definition (1920x1080)

**duration** integer

The duration of the generated video in seconds. **Note:** This parameter is only available for the Veo 2 model. Veo 2, Veo 3.1 and Veo 3.1 Fast have a fixed duration of 8 seconds.

**aspect_ratio** string

The aspect ratio of the generated video. Common options:

*   **16:9** - Widescreen (default for most content)
*   **9:16** - Portrait (ideal for mobile/social media)

**files** array

Optional reference images or videos to guide the generation process. Upload files to use as style, content, or motion references.

**service_mode** string

---


## Page 2

The service mode for video generation. This parameter controls processing priority and performance settings:

*   unstable - Reliable but may be slower at peak time (promotional pricing)
*   stable - Smooth, priority performance, no delays (original pricing)

# Model Specifications

## Veo 3.1

The latest and most advanced video generation model with enhanced quality and capabilities.

**Features:**

*   Aspect Ratios: 16:9 (widescreen)
*   Duration: 8 seconds (fixed)
*   Resolutions: 720p, 1080p (default: 720p)
*   Enhance Prompt: Always enabled and locked
*   Supported Options: Style customization, video dimensions, image input, resolution control

**Best For:** High-quality professional video content, marketing materials, and premium visual content.

## Veo 3.1 Fast

Optimized version of Veo 3.1 designed for faster processing while maintaining high quality.

**Features:**

*   Aspect Ratios: 16:9 (widescreen)
*   Duration: 8 seconds (fixed)
*   Resolutions: 720p, 1080p (default: 720p)
*   Enhance Prompt: Always enabled and locked
*   Supported Options: Style customization, video dimensions, image input, resolution control

**Best For:** Quick turnaround projects, rapid prototyping, and when speed is prioritized over maximum quality.

## Veo 2

Advanced video generation model with flexible duration options and multiple aspect ratios.

**Features:**

*   Aspect Ratios: 16:9 (widescreen), 9:16 (portrait)
*   Duration: 8 seconds (fixed)
*   Resolutions: Various options available
*   Enhance Prompt: Enabled by default but can be disabled
*   Supported Options: Style customization, video dimensions, image input, duration control

**Best For:** Social media content, mobile-first videos, and projects requiring specific duration control.

# Example Response

```json
{
    "id": 12345,
    "uuid": "vid_abc123def456",
    "user_id": 789,
    "model_name": "veo-2",
    "input_text": "A serene lake surrounded by mountains at sunset with gentle waves",
    "generate_result": "https://cdn.geminigen.ai/videos/vid_abc123def456.mp4",
    "input_file_path": "",
    "type": "video_generation",
    "used_credit": 50,
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
    "file_size": 10485760,
}

---


## Page 3

json
{
  "id": "vid_abc123def456",
  "status": "completed",
  "generate_result": "https://cdn.geminigen.ai/generations/vid_abc123def456.mp4",
  "status_percentage": 100,
  "used_credit": 5,
  "file_size": 2560000,
  "thumbnail_small": "https://cdn.geminigen.ai/thumbnails/vid_abc123def456_small.jpg",
  "duration": 8,
  "resolution": "720p",
  "aspect_ratio": "16:9",
  "created_at": "2025-08-21T13:26:53.076Z",
  "expired_at": "2025-08-21T13:26:53.076Z",
  "inference_type": "text_to_video",
  "name": "Serene Lake Sunset",
  "created_by": "user_789",
  "thumbnail_small": "https://cdn.geminigen.ai/thumbnails/vid_abc123def456_small.jpg",
  "duration": 8,
  "resolution": "720p",
  "aspect_ratio": "16:9"
}
```

## Response Fields

*   **id** - Unique identifier for the generation request
*   **uuid** - Universal unique identifier for the generated video
*   **generate_result** - URL to the generated video file
*   **status** - Generation status (1: processing, 2: completed, 3: failed)
*   **status_percentage** - Progress percentage (0-100)
*   **used_credit** - Credits consumed for this generation
*   **file_size** - Size of the generated video in bytes
*   **thumbnail_small** - URL to a small thumbnail image of the video
*   **duration** - Duration of the generated video in seconds
*   **resolution** - Resolution of the generated video
*   **aspect_ratio** - Aspect ratio of the generated video

## Status Codes

*   **1** - Processing: The video is being generated
*   **2** - Completed: Video generation successful
*   **3** - Failed: Generation failed (check error_message)

## Best Practices

1.  **Detailed Prompts:** Use descriptive, specific prompts that include movement and scene details
2.  **Duration Planning:** Consider the complexity of your scene when choosing duration
3.  **Resolution Selection:** Choose appropriate resolution for your intended use case
4.  **Aspect Ratio:** Select ratios that match your target platform or use case
5.  **Credit Management:** Video generation typically uses more credits than image generation

## Common Use Cases

*   **Marketing Videos:** Product demonstrations, promotional content, social media videos
*   **Creative Projects:** Short films, animations, artistic expressions
*   **Content Creation:** Video thumbnails, background videos, visual storytelling
*   **Prototyping:** Concept videos, storyboard visualization, motion studies
*   **Education:** Instructional videos, animated explanations, visual demonstrations

## Tips for Better Results

1.  **Motion Description:** Include specific details about how objects should move
2.  **Scene Composition:** Describe camera angles, lighting, and scene layout
3.  **Temporal Elements:** Mention timing and sequence of events in your prompt
4.  **Style Consistency:** Use consistent terminology for visual style throughout
5.  **Reference Files:** Upload reference images or videos for better style matching

---


## Page 4

&lt;img&gt;&lt;/img&gt;
Dialogue Speech
Generate multi-speaker dialogue with advanced text-to-speech capabilities.

&lt;img&gt;&lt;/img&gt;
Video Generation Sora
Generate high-quality videos from text prompts using OpenAI's Sora model.

Privacy Terms

Copyright © 2025, GeminiGen.AI