## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page
---

Resources

# Dialogue Speech

Generate multi-speaker dialogue with advanced text-to-speech capabilities.

---

The Dialogue Gen API allows you to create dynamic conversations with multiple speakers using advanced text-to-speech technology. This powerful feature enables you to generate realistic dialogues, conversations, and multi-voice content with customizable voices and speaking styles.

## Multi-Speaker TTS

POST https://api.geminigen.ai/uapi/v1/tts-multi-speaker

This endpoint allows you to generate speech with multiple speakers, creating natural-sounding conversations and dialogues. You can customize voices, speed, and other parameters for each speaker or globally for the entire dialogue.

## Example Request

```bash
curl -X POST https://api.geminigen.ai/uapi/v1/tts-multi-speaker \
  -H "Content-Type: application/json" \
  -H "x-api-key: <your api key>" \
  -d '{
    "voices": [
      {
        "name": "Puck",
        "voice": {
          "id": "OA001",
          "name": "Puck"
        }
      },
      {
        "name": "Charon",
        "voice": {
          "id": "OA002",
          "name": "Charon"
        }
      }
    ],
    "model_name": "dialogue_model",
    "model": "tts-flash",
    "speed": 1,
    "blocks": [
      {
        "input": "Hello, how are you today?"
      },
      {
        "input": "I am doing great, thank you for asking!"
      }
    ],
    "output_format": "mp3",
    "custom_prompt": "Speak naturally as if having a casual conversation",
    "output_channel": "mono",
    "name": "Casual Conversation"
  }'
```

## Request Attributes

**voices** array

An array of voice objects to be used for the dialogue. Each voice object contains a name and voice configuration. Voices will be assigned to speakers in the order they appear in the blocks.

**voices[].name** string

Display name for the voice/speaker for identification purposes.

**voices[].voice** object

Voice configuration object containing the voice details.

---


## Page 2

json
{
  "success": true,
  "result": {
    "uuid": "f1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    "voices": [
      {
        "name": "Puck",
        "voice": {
          "id": "OA001",
          "name": "Puck"
        }
      },
      {
        "name": "Charon",
        "voice": {
          "id": "OA002",
          "name": "Charon"
        }
      }
    ],
    "model_name": "dialogue_model",
    "model": "tts-flash",
    "speed": 1.0,
    "output_format": "mp3",
    "output_channel": "mono",
    "custom_prompt": "",
    "input_file_path": "",
    "input": "",
    "name": ""
  }
}
```

The voice ID to use for this speaker. You can find available voice IDs in the Voice Library.

Display name for the voice for identification and organization purposes.

The name identifier for the specific model configuration to use for dialogue generation.

The TTS model to use for speech generation. Default value is `tts-flash`.

The speed of the speech generation. Value should be between 0.5 and 4.0. Default value is 1.0.

An array of dialogue blocks, where each block represents a speaker's turn in the conversation. Each block contains the text input for that speaker.

The text content that the speaker will say. Maximum length is 10,000 characters per block.

The audio format for the generated output. Supported formats include `mp3` and `wav`. Default is `mp3`.

A custom prompt that provides additional context or instructions for how the dialogue should be delivered. This helps guide the speaking style and delivery.

The audio channel configuration for the output. Options are `mono` or `stereo`. Default is `mono`.

Alternative single voice ID if you want to use the same voice for all speakers in the dialogue.

Optional path to an input file containing the dialogue content. Can be used instead of or in addition to the blocks parameter.

Alternative single text input if you want to generate a monologue instead of a multi-speaker dialogue.

A descriptive name for the dialogue generation request. This helps with organization and identification of your generated content.

**Example Response**

```json
{
  "success": true,
  "result": {
    "uuid": "f1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
    "voices": [
      {
        "name": "Puck",
        "voice": {
          "id": "OA001",
          "name": "Puck"
        }
      },
      {
        "name": "Charon",
        "voice": {
          "id": "OA002",
          "name": "Charon"
        }
      }
    ],
    "model_name": "dialogue_model",
    "model": "tts-flash",
    "speed": 1.0,
    "output_format": "mp3",
    "output_channel": "mono",
    "custom_prompt": "",
    "input_file_path": "",
    "input": "",
    "name": ""
  }
}

---


## Page 3

json
{
  "speed": 1,
  "blocks": [
    {
      "input": "Hello, how are you today?"
    },
    {
      "input": "I am doing great, thank you for asking!"
    }
  ],
  "output_format": "mp3",
  "custom_prompt": "Speak naturally as if having a casual conversation",
  "output_channel": "mono",
  "name": "Casual Conversation",
  "estimated_credit": 120,
  "used_credit": 120,
  "status": 1,
  "status_percentage": 25,
  "error_message": "",
  "created_at": "2024-11-21T14:30:00",
  "updated_at": "2024-11-21T14:30:00"
}
```

## Response Attributes

**success** boolean

Indicates whether the request was successful.

**result** object

The result object containing details about the dialogue generation request.

**result.uuid** string

The unique identifier for the dialogue generation request.

**result.voices** array

The array of voice objects used for the dialogue generation, containing name and voice configuration details.

**result.model_name** string

The model name used for the dialogue generation.

**result.model** string

The TTS model used for speech generation.

**result.speed** float

The speed setting used for the speech generation.

**result.blocks** array

The dialogue blocks that were processed for speech generation.

**result.output_format** string

The audio format of the generated output.

**result.custom_prompt** string

The custom prompt used for guiding the dialogue delivery.

**result.output_channel** string

The audio channel configuration of the output.

**result.name** string

The descriptive name assigned to the dialogue generation.

**result.estimated_credit** integer

The estimated number of credits required for the dialogue generation.

**result.used_credit** integer

The actual number of credits used for the dialogue generation.

**result.status** integer

---


## Page 4

The current status of the dialogue generation. Possible values are:

*   1 : Processing
*   2 : Completed
*   3 : Error
*   11 : Reworking
*   12 : Joining Audio
*   13 : Merging Audio
*   14 : Downloading Audio

result.status_percentage integer

The percentage of completion for the dialogue generation process.

result.error_message string

Any error message if the generation encountered issues. Empty string if no errors.

result.created_at string

The timestamp when the dialogue generation request was created.

result.updated_at string

The timestamp when the dialogue generation request was last updated.

# Use Cases

## Podcast Creation

Generate realistic podcast conversations with multiple hosts and guests, complete with natural speaking patterns and expressive delivery.

## Educational Content

Create interactive learning materials with teacher-student dialogues, explanations, and Q&A sessions.

## Storytelling

Develop engaging narratives with character voices, bringing stories to life with distinct personalities for each speaker.

## Customer Service Training

Generate training scenarios with customer-agent interactions for staff training and simulation purposes.

## Marketing Content

Create compelling promotional dialogues, testimonials, and product demonstrations with multiple speakers.

# Best Practices

## Voice Selection

*   **Distinct Voices:** Choose voices that are clearly distinguishable from each other
*   **Character Matching:** Select voices that match the personality and role of each speaker
*   **Consistency:** Use the same voice for the same character throughout longer dialogues

## Content Structure

*   **Natural Flow:** Write dialogue that sounds natural and conversational
*   **Clear Turns:** Ensure each speaker's turn is clearly defined in separate blocks
*   **Appropriate Length:** Keep individual speaking turns to a reasonable length for natural pacing

## Speaking Style Context

*   **Custom Prompts:** Provide specific guidance for the speaking style and context
*   **Scene Setting:** Include context about the situation or environment in your custom prompt

## Technical Considerations

*   **Audio Quality:** Choose appropriate output format and channel configuration for your use case
*   **Processing Time:** Longer dialogues with multiple speakers may take more time to process

---


## Page 5

*   **Credit Usage:** Multi-speaker generation typically uses more credits than single-speaker TTS

---
&lt;img&gt;&lt;/img&gt;
**Document To Speech**
Generate lifelike speech from pdf, docx, pptx, and other document formats.

&lt;img&gt;&lt;/img&gt;
**Video Generation**
Generate high-quality videos from text prompts using advanced AI models.

Privacy Terms

Copyright © 2025, GeminiGen.AI