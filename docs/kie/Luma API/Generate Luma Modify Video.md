# Generate Luma Modify Video

> Create a new Luma modify video generation task.

## OpenAPI

````yaml luma-api/luma-api.json post /api/v1/modify/generate
paths:
  path: /api/v1/modify/generate
  method: post
  servers:
    - url: https://api.kie.ai
      description: API Server
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >-
                All APIs require authentication via Bearer Token.


                Get API Key:

                1. Visit [API Key Management Page](https://kie.ai/api-key) to
                get your API Key


                Usage:

                Add to request header:

                Authorization: Bearer YOUR_API_KEY


                Note:

                - Keep your API Key secure and do not share it with others

                - If you suspect your API Key has been compromised, reset it
                immediately in the management page
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              prompt:
                allOf:
                  - type: string
                    description: >-
                      Text prompt describing the desired video modifications.
                      Required field that specifies how the input video should
                      be modified.


                      - Should be detailed and specific about the desired
                      changes

                      - Describe the visual elements you want to add or modify

                      - IMPORTANT: Only English language is supported
                    example: >-
                      A futuristic cityscape at night with towering glass spires
                      reaching into a starry sky. Neon lights in blue and purple
                      illuminate the buildings while flying vehicles glide
                      silently between the structures.
              videoUrl:
                allOf:
                  - type: string
                    format: uri
                    description: |-
                      URL of the input video for modification. Required field.

                      - Must be a valid video URL
                      - Video must be accessible to the API server
                      - Supported formats: MP4, MOV, AVI
                      - Maximum file size: 500MB
                      - Maximum duration: 10 seconds
                    example: https://example.com/input-video.mp4
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      The URL to receive video generation task completion
                      updates. Optional but recommended for production use.


                      - System will POST task status and results to this URL
                      when video generation completes

                      - Callback includes generated video URLs and task
                      information

                      - Your callback endpoint should accept POST requests with
                      JSON payload containing video results

                      - For detailed callback format and implementation guide,
                      see [Luma Modify Video
                      Callbacks](./generate-luma-modify-video-callbacks)

                      - Alternatively, use the Get Luma Modify Details endpoint
                      to poll task status
                    example: https://your-callback-url.com/luma-callback
              watermark:
                allOf:
                  - type: string
                    description: >-
                      Watermark identifier to add to the generated video.


                      - Optional parameter

                      - If provided, a watermark will be added to the output
                      video

                      - Can be used for branding or identification purposes
                    example: your-watermark-id
            required: true
            requiredProperties:
              - prompt
              - videoUrl
            example:
              prompt: >-
                A futuristic cityscape at night with towering glass spires
                reaching into a starry sky
              videoUrl: https://example.com/input-video.mp4
              callBackUrl: https://your-callback-url.com/luma-callback
              watermark: your-watermark-id
        examples:
          example:
            value:
              prompt: >-
                A futuristic cityscape at night with towering glass spires
                reaching into a starry sky
              videoUrl: https://example.com/input-video.mp4
              callBackUrl: https://your-callback-url.com/luma-callback
              watermark: your-watermark-id
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    enum:
                      - 200
                      - 401
                      - 402
                      - 404
                      - 422
                      - 429
                      - 455
                      - 500
                      - 501
                      - 505
                    description: >-
                      Response status code


                      - **200**: Success - Request has been processed
                      successfully

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks
                       The request parameters are incorrect, please check the parameters.
                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request

                      - **501**: Generation Failed - Video generation task
                      failed

                      - **505**: Feature Disabled - The requested feature is
                      currently disabled
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: >-
                          Task ID, can be used with Get Luma Modify Details
                          endpoint to query task status
                        example: 774d9a7dd608a0e49293903095e45a4c
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 774d9a7dd608a0e49293903095e45a4c
        description: Request successful
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Server Error
        examples: {}
        description: Server Error
  deprecated: false
  type: path
components:
  schemas: {}

````