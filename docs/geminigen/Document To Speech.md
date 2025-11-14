## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

Resources

# Document To Speech

Generate lifelike speech from pdf, docx, pptx, and other document formats.

---

The GeminiGen.AI Document-to-Speech API allows you to convert files in various document formats into high-quality, natural-sounding speech. You can use this API to generate voiceovers for multimedia content, create narrations for e-books and documents, or turn subtitles into engaging audio experiences.

## Document To Speech

POST https://api.geminigen.ai/uapi/v1/document-to-speech

This endpoint allows you to convert document into speech. You can customize the voice, speed, and model used for the conversion.

## Example Request

```bash
terminal py ts

curl -X POST https://api.geminigen.ai/uapi/v1/document-to-speech \
  -H "Content-Type: multipart/form-data" \
  -H "x-api-key: <your api key>" \
  --form "model=tts-flash" \
  --form "voices=[{\\"name\\":\\"Gacrux\\",\\"voice\\":{\\"id\\":\\"GM013\\",\\"name\\":\\"Gacrux\\"}}]" \
  --form "speed=1" \
  --form "file=@/path/to/your/document.pdf" \
  --form "file_password=your_password" \
  --form "output_format=mp3"
```

## Request Attributes

**model** string

The model used for the conversion. You can choose between `tts-flash` and `tts-pro`. The default value is `tts-flash`.

**voices** array

An array of voice objects used for the conversion. Each voice object contains a name and voice details with id and name. You can find the list of available voices in the [Voice Library](https://www.example.com/voice-library).

**speed** float

The speed of the speech. The value should be between 1 and 4. The default value is 1.

**file** string($binary)

The document file to be converted. Supported formats include .docx , .xlsx , .pptx , .pdf , .epub , .mobi , .txt , .html , .odt , .ods , .odp , .azw , .azw3. The maximum file size is 100 MB and max 500,000 rows of data.

**file_password** string

The password for the document file, if it is password-protected.

**output_format** string

The audio format for the generated output. Supported formats include `mp3` and `wav`. Default is `mp3`.

## Example Response

```json
{
  "success":true,
  "result":{
    "id":1703,
    "uuid":"1722c848-8f0c-11f0-a8a1-d20de1b4070b",
    "user_id":20,
    "model_name":"tts-flash",
    "input_text":"file.pdf",
    "generate_result":null,

---


## Page 2

json
{
  "input_file_path": null,
  "type": "tts-document",
  "used_credit": 0,
  "status": 1,
  "status_desc": "",
  "status_percentage": 1,
  "error_code": "",
  "error_message": "",
  "rating": "",
  "rating_content": "",
  "custom_prompt": null,
  "created_at": "2025-09-11T12:37:33",
  "updated_at": null,
  "file_size": 44330,
  "file_password": null,
  "expired_at": null,
  "inference_type": "gemini_voice",
  "name": "file.pdf",
  "created_by": "API",
  "is_premium_credit": true,
  "emotion": null,
  "note": null,
  "estimated_credit": 0,
  "ai_credit": 0,
  "media_type": "audio",
  "service_mode": null
}
```

## Response Attributes

**success** boolean

Indicates whether the request was successful.

**result** object

The result of the document-to-speech conversion.

**result.id** integer

The unique ID for the conversion.

**result.uuid** string

The unique identifier for the conversion.

**result.user_id** integer

The ID of the user who initiated the conversion.

**result.model_name** string

The model used for the conversion.

**result.input_text** string

The name of the document file that was converted into speech.

**result.generate_result** null

The generation result (null during processing).

**result.input_file_path** null

The input file path (null during processing).

**result.type** string

The type of conversion, always "tts-document" for document-to-speech.

**result.used_credit** integer

The actual number of credits used for the conversion.

**result.status** integer

The status of the conversion. Possible values are:

*   1 : Converting
*   2 : Completed
*   3 : Error

---


## Page 3

*   11 : Reworking
*   12 : Joining Audio
*   13 : Merging Audio
*   14 : Downloading Audio

`result.status_desc` string

The status description.

`result.status_percentage` integer

The percentage of the conversion that has been completed.

`result.error_code` string

The error code, if any.

`result.error_message` string

The error message, if any.

`result.rating` string

The rating for the conversion.

`result.rating_content` string

The rating content.

`result.custom_prompt` null

Custom prompt used for the conversion (null if not used).

`result.created_at` string

The date and time when the conversion was created.

`result.updated_at` null

The date and time when the conversion was last updated (null if not updated).

`result.file_size` integer

The size of the document file in bytes.

`result.file_password` null

The password for the document file (null if not password-protected).

`result.expired_at` null

The expiration date of the conversion (null if not set).

`result.inference_type` string

The type of inference used for the conversion.

`result.name` string

The name of the conversion task.

`result.created_by` string

The source that created the conversion (e.g., "API").

`result.is_premium_credit` boolean

Indicates whether premium credits were used.

`result.emotion` null

The emotion setting for the conversion (null if not set).

`result.note` null

Additional notes for the conversion (null if not set).

`result.estimated_credit` integer

The estimated number of credits for the conversion.

`result.ai_credit` integer

---


## Page 4

The AI credits used for the conversion.

```json
{
  "result.media_type": "string",
  "result.service_mode": null
}
```

The type of media generated (e.g., "audio").

The service mode used for the conversion (null if not set).

Privacy Terms

Copyright © 2025, GeminiGen.AI