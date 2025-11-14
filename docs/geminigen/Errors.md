## Page 1

&lt;img&gt;GeminiGen AI logo&lt;/img&gt; GeminiGen AI

On this page

Introduction

# Errors

What happens when things go wrong? Learn how to handle errors and troubleshoot issues with the TTS API.

In this guide, we will talk about what happens when things go wrong with the Text-to-Speech (TTS) API and how you can handle errors and troubleshoot issues. Mistakes happen, and mostly they are due to incorrect input data, network issues, or server problems. We will cover the common error codes and how to resolve them.

You can tell if your request was successful by checking the status code when receiving an API response. If a response comes back unsuccessful, you can use the error type and error message to figure out what has gone wrong and do some rudimentary debugging (before contacting support).

Before reaching out to support with an error, please be aware that 99% of all reported errors are, in fact, user errors. Therefore, please carefully check your code before contacting TTS OpenAI support.

## Status Codes

Here is a list of common status codes you might encounter when using the TTS OpenAI API. Use these to understand if a request was successful.

<table>
<tr><td>200</td><td>- OK</td></tr>
<tr><td>400</td><td>- Bad Request</td></tr>
<tr><td>401</td><td>- Unauthorized</td></tr>
<tr><td>403</td><td>- Forbidden</td></tr>
<tr><td>404</td><td>- Not Found</td></tr>
<tr><td>429</td><td>- Too Many Requests</td></tr>
<tr><td>500</td><td>- Internal Server Error</td></tr>
<tr><td>503</td><td>- Service Unavailable</td></tr>
</table>

## Error Types

Whenever a request is unsuccessful, the GeminiGen.AI API will return an error response with an error type and message. You can use this information to understand better what has gone wrong and how to fix it. Most of the error messages are pretty helpful and actionable.

Error Response

```json
{
  "detail": {
    "error_code": "API_KEY_NOT_FOUND",
    "message": "Api key is not found"
  }
}
```

Here are some common error types you might encounter:

### API_KEY_REQUIRED

The API key is required to authenticate your request. Make sure you have included your API key in the `x-api-key` header.

### USER_NOT_FOUND

The user is not found in the system. Make sure you have signed up for an account and have a valid API key.

### API_KEY_NOT_FOUND

The API key is not found in the system. Make sure you have entered the correct API key.

### NOT_ENOUGH_CREDIT

You do not have enough credits to perform the current action. Check your account balance and top up if necessary.

### NOT_ENOUGH_AND_LOCK_CREDIT

You don't have enough credit because of locked credit. Please check your transaction history for more details.

---


## Page 2

# TEXT_TOO_LONG

The text you are trying to convert is too long. The maximum text length is 10000 characters.

# MAXIMUM_FILE_SIZE_EXCEED

The file you are trying to upload exceeds the maximum file size limit. Please upload a smaller file.

# FILE_TYPE_NOT_ALLOWED

The file type you are trying to upload is not allowed. Please upload a file with a supported file type.

# PDF_MORE_THAN_400_PAGES

Please upload PDF files with less than 400 pages.

# PLAN_MAX_FILE_SIZE_EXCEED

The file size exceeds your plan's limit. Please upgrade your plan to process larger files.

# PREMIUM_PLAN_REQUIRED

A premium plan is required to perform this action. Please upgrade your plan.

# PLAN_TOTAL_FILE_EXCEED

The number of monthly file processing exceeds your plan's limit. Please upgrade your plan to process more files.

# VOICE_NOT_FOUND

The voice you are trying to use is not found. Make sure you have entered the correct voice ID.

# VOICE_NOT_ACTIVE

The voice you are trying to use is not active. Make sure you have activated the voice in your account settings.

# GEMINI_RATE_LIMIT

The request has exceeded the rate limit for the Gemini API. Please wait before making additional requests or consider upgrading your plan for higher rate limits.

# GEMINI_RAI_MEDIA_FILTERED

The media content has been filtered by Gemini's Responsible AI (RAI) system. The content may violate safety guidelines or contain inappropriate material.

# FORBIDDEN

You do not have permission to access the requested resource. Make sure you have the correct permissions.

# SYSTEM_ERROR

An internal system error occurred. Please try again later or contact support if the issue persists.

# Troubleshooting

If you encounter an error while using the GeminiGen.AI API, here are some steps you can take to troubleshoot the issue:

1. **Check the error message**: Read the error message carefully to understand what went wrong. The error message will usually provide a clue as to what caused the error.
2. **Check the error type**: Look at the error type to determine the nature of the error. This will help you identify the root cause of the issue.
3. **Check your input data**: Verify that the input data you provided is correct and formatted properly. Common issues include incorrect API keys, missing required parameters, or invalid data types.
4. **Check your network connection**: Ensure that you have a stable internet connection and that there are no network issues preventing your request from reaching the server.
5. **Check the server status**: Check the status of the GeminiGen.AI API server to see if there are any known issues or outages.
6. **Contact support**: If you are unable to resolve the issue on your own, please contact GeminiGen.AI support for further assistance. Provide as much detail as possible about the error you encountered to help us diagnose the problem quickly.

By following these steps, you should be able to identify and resolve most common errors you may encounter while using the GeminiGen.AI API. If you continue to experience issues, please don't hesitate to reach out to our support team for help. We are here to assist you and ensure you have a smooth experience using our API.

---


## Page 3

Making requests
Make your first request to the GeminiGen.AI API and get started with the powerful AI generation features.

Text to Speech
Generate lifelike speech from text in multiple languages and voices.

Privacy Terms

Copyright © 2025, GeminiGen.AI