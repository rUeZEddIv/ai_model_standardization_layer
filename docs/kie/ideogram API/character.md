# Character API Documentation

> Generate content using the Character model

## Overview

This document describes how to use the Character model for content generation. The process consists of two steps:
1. Create a generation task
2. Query task status and results

## Authentication

All API requests require a Bearer Token in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

Get API Key:
1. Visit [API Key Management Page](https://kie.ai/api-key) to get your API Key
2. Add to request header: `Authorization: Bearer YOUR_API_KEY`

---

## 1. Create Generation Task

### API Information
- **URL**: `POST https://api.kie.ai/api/v1/jobs/createTask`
- **Content-Type**: `application/json`

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model name, format: `ideogram/character` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications. If provided, the system will send POST requests to this URL when the task completes (success or fail). If not provided, no callback notifications will be sent. Example: `"https://your-domain.com/api/callback"` |

### Model Parameter

The `model` parameter specifies which AI model to use for content generation.

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `ideogram/character` | The exact model identifier for this API |
| **Type** | string | Must be passed as a string value |
| **Required** | Yes | This parameter is mandatory for all requests |

> **Note**: The model parameter must match exactly as shown above. Different models have different capabilities and parameter requirements.

### Callback URL Parameter

The `callBackUrl` parameter allows you to receive automatic notifications when your task completes.

| Property | Value | Description |
|----------|-------|-------------|
| **Purpose** | Task completion notification | Receive real-time updates when your task finishes |
| **Method** | POST request | The system sends POST requests to your callback URL |
| **Timing** | When task completes | Notifications sent for both success and failure states |
| **Content** | Query Task API response | Callback content structure is identical to the Query Task API response |
| **Parameters** | Complete request data | The `param` field contains the complete Create Task request parameters, not just the input section |
| **Optional** | Yes | If not provided, no callback notifications will be sent |

**Important Notes:**
- The callback content structure is identical to the Query Task API response
- The `param` field contains the complete Create Task request parameters, not just the input section  
- If `callBackUrl` is not provided, no callback notifications will be sent

### input Object Parameters

#### prompt
- **Type**: `string`
- **Required**: Yes
- **Description**: The prompt to fill the masked part of the image.
- **Max Length**: 5000 characters
- **Default Value**: `"Place the woman from the uploaded portrait, wearing a casual white blouse, in a peaceful garden setting. The scene should feature vibrant green plants and colorful flowers, with soft sunlight filtering through the leaves. She should be sitting on a wooden bench, holding a book and smiling gently. The background should be filled with lush greenery, with a serene, tranquil atmosphere. Golden afternoon light should highlight the woman’s face and create soft shadows on the ground, adding a peaceful, reflective mood to the scene"`

#### reference_image_urls
- **Type**: `array`
- **Required**: Yes
- **Description**: A set of images to use as character references. Currently only 1 image is supported, rest will be ignored. (maximum total size 10MB across all character references). The images should be in JPEG, PNG or WebP format
- **Max File Size**: 10MB
- **Accepted File Types**: image/jpeg, image/png, image/webp
- **Multiple Files**: Yes
- **Default Value**: `["https://file.aiquickdraw.com/custom-page/akr/section-images/1755767145415pvz49dpi.webp"]`

#### rendering_speed
- **Type**: `string`
- **Required**: No
- **Description**: The rendering speed to use. Default value: "BALANCED"
- **Options**:
  - `TURBO`: TURBO
  - `BALANCED`: BALANCED
  - `QUALITY`: QUALITY
- **Default Value**: `"BALANCED"`

#### style
- **Type**: `string`
- **Required**: No
- **Description**: The style type to generate with. Cannot be used with style_codes. Default value: "AUTO"
- **Options**:
  - `AUTO`: AUTO
  - `REALISTIC`: REALISTIC
  - `FICTION`: FICTION
- **Default Value**: `"AUTO"`

#### expand_prompt
- **Type**: `boolean`
- **Required**: No
- **Description**: Determine if MagicPrompt should be used in generating the request or not. Default value: true
- **Default Value**: `true`

#### num_images
- **Type**: `string`
- **Required**: No
- **Description**: Select description
- **Options**:
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4
- **Default Value**: `"1"`

#### image_size
- **Type**: `string`
- **Required**: No
- **Description**: The resolution of the generated image Default value: square_hd
- **Options**:
  - `square`: Square 1:1
  - `square_hd`: square_hd
  - `portrait_4_3`: Portrait 3:4
  - `portrait_16_9`: Portrait 9:16
  - `landscape_4_3`: Landscape 4:3
  - `landscape_16_9`: Landscape 16:9
- **Default Value**: `"square_hd"`

#### seed
- **Type**: `number`
- **Required**: No
- **Description**: Seed for the random number generator

#### negative_prompt
- **Type**: `string`
- **Required**: No
- **Description**: Description of what to exclude from an image. Descriptions in the prompt take precedence to descriptions in the negative prompt. Default value: ""
- **Max Length**: 5000 characters
- **Default Value**: `""`

### Request Example

```json
{
  "model": "ideogram/character",
  "input": {
    "prompt": "Place the woman from the uploaded portrait, wearing a casual white blouse, in a peaceful garden setting. The scene should feature vibrant green plants and colorful flowers, with soft sunlight filtering through the leaves. She should be sitting on a wooden bench, holding a book and smiling gently. The background should be filled with lush greenery, with a serene, tranquil atmosphere. Golden afternoon light should highlight the woman’s face and create soft shadows on the ground, adding a peaceful, reflective mood to the scene",
    "reference_image_urls": ["https://file.aiquickdraw.com/custom-page/akr/section-images/1755767145415pvz49dpi.webp"],
    "rendering_speed": "BALANCED",
    "style": "AUTO",
    "expand_prompt": true,
    "num_images": "1",
    "image_size": "square_hd",
    "seed": 42,
    "negative_prompt": "Enter your prompt here..."
  }
}
```
### Response Example

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "281e5b0*********************f39b9"
  }
}
```

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| code | integer | Response status code, 200 indicates success |
| msg | string | Response message |
| data.taskId | string | Task ID for querying task status |

---

## 2. Query Task Status

### API Information
- **URL**: `GET https://api.kie.ai/api/v1/jobs/recordInfo`
- **Parameter**: `taskId` (passed via URL parameter)

### Request Example
```
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=281e5b0*********************f39b9
```

### Response Example

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "281e5b0*********************f39b9",
    "model": "ideogram/character",
    "state": "waiting",
    "param": "{\"model\":\"ideogram/character\",\"input\":{\"prompt\":\"Place the woman from the uploaded portrait, wearing a casual white blouse, in a peaceful garden setting. The scene should feature vibrant green plants and colorful flowers, with soft sunlight filtering through the leaves. She should be sitting on a wooden bench, holding a book and smiling gently. The background should be filled with lush greenery, with a serene, tranquil atmosphere. Golden afternoon light should highlight the woman’s face and create soft shadows on the ground, adding a peaceful, reflective mood to the scene\",\"reference_image_urls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/1755767145415pvz49dpi.webp\"],\"rendering_speed\":\"BALANCED\",\"style\":\"AUTO\",\"expand_prompt\":true,\"num_images\":\"1\",\"image_size\":\"square_hd\",\"seed\":42,\"negative_prompt\":\"Enter your prompt here...\"}}",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/1755767162656b627m4yp.webp\"]}",
    "failCode": null,
    "failMsg": null,
    "costTime": null,
    "completeTime": null,
    "createTime": 1757584164490
  }
}
```

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| code | integer | Response status code, 200 indicates success |
| msg | string | Response message |
| data.taskId | string | Task ID |
| data.model | string | Model name used |
| data.state | string | Task status: `waiting`(waiting),  `success`(success), `fail`(fail) |
| data.param | string | Task parameters (JSON string) |
| data.resultJson | string | Task result (JSON string, available when task is success). Structure depends on outputMediaType: `{resultUrls: []}` for image/media/video, `{resultObject: {}}` for text |
| data.failCode | string | Failure code (available when task fails) |
| data.failMsg | string | Failure message (available when task fails) |
| data.costTime | integer | Task duration in milliseconds (available when task is success) |
| data.completeTime | integer | Completion timestamp (available when task is success) |
| data.createTime | integer | Creation timestamp |

---

## Usage Flow

1. **Create Task**: Call `POST https://api.kie.ai/api/v1/jobs/createTask` to create a generation task
2. **Get Task ID**: Extract `taskId` from the response
3. **Wait for Results**: 
   - If you provided a `callBackUrl`, wait for the callback notification
   - If no `callBackUrl`, poll status by calling `GET https://api.kie.ai/api/v1/jobs/recordInfo`
4. **Get Results**: When `state` is `success`, extract generation results from `resultJson`

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request successful |
| 400 | Invalid request parameters |
| 401 | Authentication failed, please check API Key |
| 402 | Insufficient account balance |
| 404 | Resource not found |
| 422 | Parameter validation failed |
| 429 | Request rate limit exceeded |
| 500 | Internal server error |

