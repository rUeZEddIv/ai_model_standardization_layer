## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page

Resources

# Text to Speech

Generate lifelike speech from text in multiple languages and voices.

The GeminiGen.AI Text-to-Speech API allows you to convert text into high-quality, natural-sounding speech. You can use this API to generate voiceovers for multimedia content, create narrations for e-books and documents, or turn subtitles into engaging audio experiences.

## Text To Speech

POST https://api.geminigen.ai/uapi/v1/text-to-speech

This endpoint allows you to convert text into speech. You can customize the voice, speed, and model used for the conversion.

## Example Request

terminal py ts

```bash
curl -X POST https://api.geminigen.ai/uapi/v1/text-to-speech \
  -H "Content-Type: application/json" \
  -H "x-api-key: <your api key>" \
  -d '{
    "model": "tts-flash",
    "voices":[
      {
        "name":"Gacrux",
        "voice":{
          "id":"GM013",
          "name":"Gacrux"
        }
      }
    ],
    "speed": 1,
    "input": "Hello, my name is GeminiGen.AI. I am a text-to-speech model.",
    "output_format": "mp3"
  }'
```

## Request Attributes

model string

The model used for the conversion. You can choose between `tts-flash` and `tts-pro`. The default value is `tts-flash`.

voices array

An array of voice objects used for the conversion. Each voice object contains a name and voice details with id and name. You can find the list of available voices in the Voice Library.

speed float

The speed of the speech. The value should be between 1 and 4. The default value is 1.

input string

The text to be converted into speech. The maximum length is 10,000 characters.

output_format string

The audio format for the generated output. Supported formats include `mp3` and `wav`. Default is `mp3`.

## Example Response

Response

```json
{
  "success":true,
  "result":{
    "id":1702,
    "uuid":"fee4c104-8f07-11f0-a8a1-d20de1b4070b",

---


## Page 2

json
{
  "user_id": 20,
  "model_name": "tts-flash",
  "input_text": "Hello, my name is GeminiGen.AI. I am a text-to-speech model.",
  "generate_result": null,
  "input_file_path": null,
  "type": "tts-text",
  "used_credit": 0,
  "status": 1,
  "status_desc": "",
  "status_percentage": 50,
  "error_code": "",
  "error_message": "",
  "rating": "",
  "rating_content": "",
  "custom_prompt": null,
  "created_at": "2025-09-11T12:08:15",
  "updated_at": null,
  "file_size": 0,
  "file_password": "",
  "expired_at": null,
  "inference_type": "gemini_voice",
  "name": "Hello, my name is GeminiGen.AI. I am a text-to-spe",
  "created_by": "API",
  "is_premium_credit": true,
  "emotion": null,
  "note": "logged-in user: 20, plan_id PP0001",
  "estimated_credit": 120,
  "ai_credit": 0,
  "media_type": "audio",
  "service_mode": null
}
```

## Response Attributes

**success** boolean
Indicates whether the request was successful.

**result** object
The result of the text-to-speech conversion.

**result.uuid** string
The unique identifier for the conversion.

**result.voices** array
An array of voice objects used for the conversion. Each voice object contains a name and voice details with id and name.

**result.speed** float
The speed of the speech.

**result.model** string
The model used for the conversion.

**result.tts_input** string
The text that was converted into speech.

**result.estimated_credit** integer
The estimated number of credits used for the conversion.

**result.used_credit** integer
The actual number of credits used for the conversion.

**result.status** integer
The status of the conversion. Possible values are:

*   1 : Converting
*   2 : Completed
*   3 : Error
*   11 : Reworking
*   12 : Joining Audio

---


## Page 3

*   13 : Merging Audio
*   14 : Downloading Audio

```json
{
  "result.status_percentage": integer,
  "result.error_message": string,
  "result.speaker_name": string,
  "result.created_at": string,
  "result.updated_at": string
}
```

---

## Errors
What happens when things go wrong? Learn how to handle errors and troubleshoot issues with the TTS API.

## Document To Speech
Generate lifelike speech from pdf, docx, pptx, and other document formats.

Privacy Terms
Copyright © 2025, GeminiGen.AI