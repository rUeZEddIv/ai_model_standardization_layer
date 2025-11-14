## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

Resources

# Video Generation Sora

Generate high-quality videos from text prompts using OpenAI's Sora model.

---

The GeminiGen.AI Video Generation Sora API provides access to OpenAI's advanced Sora model for creating high-quality videos from text prompts. Sora is known for its exceptional ability to generate realistic and creative video content with impressive temporal consistency and visual quality.

## Generate Video Sora

POST https://api.geminigen.ai/uapi/v1/video-gen/sora

This endpoint allows you to generate videos from text prompts using OpenAI's Sora model. You can customize the resolution, duration, aspect ratio, and use reference files to create sophisticated video content.

## Example Request

```bash
terminal py js

curl -X POST https://api.geminigen.ai/uapi/v1/video-gen/sora \
  -H "Content-Type: multipart/form-data" \
  -H "x-api-key: <your api key>" \
  --form "prompt=A golden retriever puppy playing in a field of sunflowers during golden hour" \
  --form "model=sora-2" \
  --form "resolution=large" \
  --form "duration=10" \
  --form "aspect_ratio=landscape"
```

## Request Parameters

**prompt** string required

The text description of the video you want to generate. Sora excels at understanding complex scenes, so you can be very detailed in your descriptions. Include information about characters, settings, movements, camera angles, and visual style.

**model** string

The Sora model variant to use for video generation. Available models include:

*   sora-2 - Latest Sora 2 model with enhanced capabilities and improved quality
*   sora-2-pro - Professional version of Sora 2 with maximum quality and advanced features

**duration** integer

The duration of the generated video in seconds. Only two duration options are supported:

*   10 - 10 seconds duration
*   15 - 15 seconds duration

**resolution** string

The resolution of the generated video:

*   small - 720p (1280x720) - Faster generation, lower file size
*   large - 1080p (1920x1080) - Higher quality, larger file size

**aspect_ratio** string

The aspect ratio of the generated video:

*   landscape - Horizontal orientation (16:9 aspect ratio)
*   portrait - Vertical orientation (9:16 aspect ratio)

**files** array

Optional reference images or videos to guide the generation process. Sora can use these files as:

*   Style references for visual consistency

---


## Page 2

* Content references for specific objects or scenes
* Motion references for movement patterns

# Model Specifications

## Sora 2

The latest generation of OpenAI's video generation model with significantly improved quality, understanding, and capabilities.

**Features:**

*   **Aspect Ratios:** Landscape (16:9), Portrait (9:16)
*   **Duration:** 10 or 15 seconds
*   **Resolutions:** 720p (small), 1080p (large)
*   **Enhanced Understanding:** Superior comprehension of physics, object interactions, and temporal consistency
*   **Improved Quality:** Better visual fidelity, more realistic textures and lighting
*   **Complex Scenes:** Excellent at generating multi-character scenes and intricate environments

**Best For:** High-quality content creation, commercial projects, artistic videos, and general-purpose video generation.

## Sora 2 Pro

Professional-grade version of Sora 2 designed for maximum quality and advanced creative control.

**Features:**

*   **Aspect Ratios:** Landscape (16:9), Portrait (9:16)
*   **Duration:** 10 or 15 seconds with superior consistency
*   **Resolutions:** 720p (small), 1080p (large) with enhanced quality
*   **Professional Quality:** Maximum visual fidelity and detail preservation
*   **Advanced Controls:** Enhanced prompt understanding and creative interpretation
*   **Cinematic Output:** Professional-grade results suitable for commercial use

**Best For:** Professional video production, high-end commercial content, cinematic projects, and when maximum quality is required.

## Example Response

```json
{
  "id": 67890,
  "uuid": "sora_xyz789abc123",
  "user_id": 456,
  "model_name": "sora-2",
  "input_text": "A golden retriever puppy playing in a field of sunflowers during golden hour",
  "type": "video_generation_sora",
  "status": 1,
  "status_desc": "processing",
  "status_percentage": 25,
  "error_code": "",
  "error_message": "",
  "custom_prompt": "",
  "expired_at": "2025-11-28T14:35:15.573Z",
  "name": "Golden Hour Puppy",
  "estimated_credit": 75,
  "media_type": "video/mp4",
  "created_at": "2025-10-28T14:35:15.573Z",
  "updated_at": "2025-10-28T14:35:15.573Z"
}
```

## Response Fields

*   id - Unique identifier for the generation request
*   uuid - Universal unique identifier for the generated video
*   model_name - The Sora model used for generation
*   input_text - The original prompt used for generation
*   type - Type of generation (video_generation_sora)
*   status - Generation status (1: processing, 2: completed, 3: failed)

---


## Page 3

<table>
<thead>
<tr>
<td>status_percentage</td>
<td>- Progress percentage (0-100)</td>
</tr>
</thead>
<tbody>
<tr>
<td>estimated_credit</td>
<td>- Estimated credits that will be consumed</td>
</tr>
<tr>
<td>media_type</td>
<td>- MIME type of the generated content</td>
</tr>
<tr>
<td>expired_at</td>
<td>- Expiration date for the generated content</td>
</tr>
<tr>
<td>name</td>
<td>- Display name for the generated video</td>
</tr>
</tbody>
</table>

**Status Codes**

*   1 - Processing: The video is being generated by Sora
*   2 - Completed: Video generation successful, download URL available
*   3 - Failed: Generation failed (check error_message for details)

**Best Practices**

1. **Detailed Descriptions**: Sora understands complex prompts, so include rich details about scenes, characters, and actions
2. **Physics Awareness**: Sora excels at realistic physics, so describe natural movements and interactions
3. **Camera Work**: Include camera movement descriptions (pan, zoom, dolly) for dynamic shots
4. **Lighting & Atmosphere**: Specify lighting conditions and mood for better visual results
5. **Character Consistency**: For multi-shot scenes, be consistent in character descriptions

**Common Use Cases**

*   **Storytelling**: Narrative videos with character development and plot progression
*   **Commercial Content**: Product demonstrations, brand videos, advertising materials
*   **Artistic Expression**: Creative and experimental video content
*   **Educational Content**: Instructional videos with clear visual demonstrations
*   **Social Media**: Engaging content for platforms like Instagram, TikTok, and YouTube Shorts

**Tips for Better Results with Sora**

1. **Scene Composition**: Describe the environment, characters, and their relationships clearly
2. **Movement Dynamics**: Specify how objects and characters should move through space
3. **Temporal Elements**: Describe the sequence of events and timing
4. **Visual Style**: Include artistic style references (cinematic, documentary, animation style)
5. **Reference Files**: Use reference images to guide style, composition, or specific visual elements
6. **Consistency**: Maintain consistent terminology and descriptions throughout longer prompts

**Credit Consumption**

Sora video generation typically consumes more credits than other models due to its advanced capabilities:

*   Resolution affects credit usage (large uses more than small)
*   Duration directly impacts credit consumption
*   Model variant (sora-2 vs sora-2-pro) affects pricing
*   Reference files may increase credit usage

**Technical Considerations**

*   **Processing Time**: Sora may take longer to generate due to its complexity
*   **File Size**: Higher quality output results in larger file sizes
*   **Temporal Consistency**: Sora maintains better consistency across frames
*   **Physics Simulation**: Advanced understanding of real-world physics and motion

---
Video Generation
Generate high-quality videos from text prompts using advanced AI models.

Image Generation
Generate stunning, high-quality images from text prompts using advanced AI models.

---


## Page 4

Privacy Terms

Copyright © 2025, GeminiGen.AI