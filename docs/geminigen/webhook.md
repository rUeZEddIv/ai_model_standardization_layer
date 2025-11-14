## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

## Introduction

# Webhooks

Receive notifications from your API requests in real-time with webhooks.

---

GeminiGen.AI can send HTTP POST requests to your server when an API request is completed. This feature is called webhooks. Webhooks are a powerful way to receive real-time updates on the status of your API requests including TTS, video generation, and image generation. You can download the generated files, check the status of the request, and more.

You can test webhooks using a service like [RequestBin](https://requestbin.com).

## Webhook Setup

### Register Webhook URL

To receive the notifications, you need to setup a webhook URL in your **Service Integration** settings. The URL should be accessible from the internet and respond to POST requests. Each notification event will have one `event` field which can be used by your server to identify the type of event.

When your application receives a webhook notification, it should respond with a `200 OK` status code. If your server does not respond with a `200 OK` status code, GeminiGen.AI will retry sending the notification for up to 3 times, with a delay of 1 hour between each retry.

### Verify Signature

With the security concerns, it is highly recommended that clients verify the authenticity of the webhook requests by validating the `x-signature` header. The `x-signature` header is a HMAC-SHA256 hash of the request body signed with our private key.

Here is an example of how to verify the signature:

1. Download the public key from here: [Public Key](https://example.com/public_key.pem)
2. Use the following code to verify the signature:

```python
def verify_signature_by_public_key(data: str, signature: bytes, public_key_path: str) -> bool:
    try:
        # Load your public key
        with open(public_key_path, "rb") as key_file:
            public_key = load_pem_public_key(key_file.read())

        # Create MD5 hash of the data
        event_data_hash = md5(data.encode()).digest()
        print(event_data_hash.hex())
        # Verify the signature
        public_key.verify(
            signature,
            event_data_hash,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except Exception as e:
        print(str(e))
        return False

result = verify_signature_by_public_key(event_uuid, bytes.fromhex(signature), "path/to/public/key/public_key.pem")
```

If the signature is valid, the function will return `true`, otherwise it will return `false`. If the signature is invalid, you should not process the webhook request.

We are not responsible for any data loss or security issues if you process the webhook request without verifying the signature.

### Webhook Payload

The webhook payload is sent as a JSON object in the body of the POST request. The payload will contain the following fields:

*   `event`: The type of event
*   `uuid`: The unique identifier of the event

---


## Page 2

*   `data` : The object containing the details of the API request

## TTS Request Data Fields

For TTS-related events, the `data` object contains:

*   `uuid` : The unique identifier of the TTS API request
*   `media_url` : The URL to download the audio file
*   `tts_input` : The text that was converted to speech
*   `voice_id` : The voice used for the conversion
*   `speed` : The speed of the speech
*   `status` : The status of the conversion
*   `model` : The model used for the conversion
*   `used_credit` : The number of credits used for the conversion
*   `speaker_name` : The name of the voice
*   `error_message` : The error message if the conversion failed
*   `status_percentage` : The percentage of the conversion completed
*   `created_at` : The date and time when the request was created
*   `updated_at` : The date and time when the request was updated

## Video Generation Request Data Fields

For video generation events, the `data` object contains:

*   `uuid` : The unique identifier of the video generation request
*   `media_url` : The URL to download the generated video file
*   `prompt` : The text prompt used for video generation
*   `model` : The model used for video generation
*   `resolution` : The resolution of the generated video
*   `duration` : The duration of the generated video
*   `aspect_ratio` : The aspect ratio of the generated video
*   `status` : The status of the generation
*   `used_credit` : The number of credits used for the generation
*   `error_message` : The error message if the generation failed
*   `status_percentage` : The percentage of the generation completed
*   `created_at` : The date and time when the request was created
*   `updated_at` : The date and time when the request was updated

## Image Generation Request Data Fields

For image generation events, the `data` object contains:

*   `uuid` : The unique identifier of the image generation request
*   `media_url` : The URL to download the generated image file
*   `prompt` : The text prompt used for image generation
*   `model` : The model used for image generation
*   `aspect_ratio` : The aspect ratio of the generated image
*   `style` : The style applied to the generated image
*   `status` : The status of the generation
*   `used_credit` : The number of credits used for the generation
*   `error_message` : The error message if the generation failed
*   `status_percentage` : The percentage of the generation completed
*   `created_at` : The date and time when the request was created
*   `updated_at` : The date and time when the request was updated

## Webhook Events

Events related to API requests are sent as JSON payloads in the body of the POST request.

### TTS Text Success

This event is sent when the TTS Text API request is successfully completed. The `event` field will be `TTS_TEXT_SUCCESS`.

### TTS Text Failure

---


## Page 3

This event is sent when the TTS Text API request fails. The `event` field will be `TTS_TEXT_FAILED`.

## TTS Document Success

This event is sent when the TTS Document API request is successfully completed. The `event` field will be `TTS_DOCUMENT_SUCCESS`.

## TTS Document Failure

This event is sent when the TTS Document API request fails. The `event` field will be `TTS_DOCUMENT_FAILED`.

## Video Generation Completed

This event is sent when the Video Generation API request is successfully completed. The `event` field will be `VIDEO_GENERATION_COMPLETED`.

## Video Generation Failed

This event is sent when the Video Generation API request fails. The `event` field will be `VIDEO_GENERATION_FAILED`.

## Image Generation Completed

This event is sent when the Image Generation API request is successfully completed. The `event` field will be `IMAGE_GENERATION_COMPLETED`.

## Image Generation Failed

This event is sent when the Image Generation API request fails. The `event` field will be `IMAGE_GENERATION_FAILED`.

You can send the webhook event for testing purposes from the Service Integration settings.

---

| Authentication | Making requests |
| :------------- | :-------------- |
| We provide a secure and straightforward authentication process to ensure the safety of your data and account. | Make your first request to the GeminiGen.AI API and get started with the powerful AI generation features. |

Privacy Terms

Copyright © 2025, GeminiGen.AI