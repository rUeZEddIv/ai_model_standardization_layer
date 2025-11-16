# Add Vocals

> This endpoint layers AI-generated vocals on top of an existing instrumental. Given a prompt (e.g., lyrical concept or musical mood) and optional audio, it produces vocal output harmonized with the provided track.

## OpenAPI

````yaml suno-api/suno-api.json post /api/v1/generate/add-vocals
paths:
  path: /api/v1/generate/add-vocals
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
                      Prompt for generating audio. Usually text describing audio
                      content, used to guide vocal singing content and style.
                    example: A calm and relaxing piano track.
              model:
                allOf:
                  - type: string
                    description: |-
                      The AI model version to use for generation.    
                      - Available options: 
                        - **`V5`**: Superior musical expression, faster generation.  
                        - **`V4_5PLUS`**: V4.5+ is richer sound, new ways to create.  
                    enum:
                      - V4_5PLUS
                      - V5
                    default: V4_5PLUS
                    example: V4_5PLUS
              title:
                allOf:
                  - type: string
                    description: >-
                      Music title. Will be displayed in the player interface and
                      file name.
                    example: Relaxing Piano
              negativeTags:
                allOf:
                  - type: string
                    description: >-
                      Excluded music styles. Used to avoid including specific
                      styles or elements in the generated music.
                    example: heavy metal, strong drum beats
              style:
                allOf:
                  - type: string
                    description: >-
                      Music style. Such as jazz, electronic, classical and other
                      music types.
                    example: Jazz
              vocalGender:
                allOf:
                  - type: string
                    description: >-
                      Vocal gender preference. Optional. 'm' for male, 'f' for
                      female. Based on practice, this parameter can only
                      increase the probability but cannot guarantee adherence to
                      male/female voice instructions.
                    enum:
                      - m
                      - f
                    example: m
              styleWeight:
                allOf:
                  - type: number
                    description: >-
                      Adherence strength to specified style. Optional. Range
                      0–1, up to 2 decimal places.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.61
              weirdnessConstraint:
                allOf:
                  - type: number
                    description: >-
                      Controls experimental/creative deviation level. Optional.
                      Range 0–1, up to 2 decimal places.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.72
              audioWeight:
                allOf:
                  - type: number
                    description: >-
                      Relative weight of audio elements. Optional. Range 0–1, up
                      to 2 decimal places.
                    minimum: 0
                    maximum: 1
                    multipleOf: 0.01
                    example: 0.65
              uploadUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      URL of the uploaded audio file. Specifies the source audio
                      file location for adding vocals.
                    example: https://example.com/music.mp3
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      URL address for receiving vocal generation task completion
                      updates. This parameter is required for all vocal
                      generation requests.


                      - The system will send a POST request to this URL when
                      vocal generation is completed, including task status and
                      results

                      - Callback process has three stages: `text` (text
                      generation), `first` (first track completed), `complete`
                      (all completed)

                      - Your callback endpoint should be able to accept POST
                      requests containing JSON payloads with music generation
                      results

                      - Alternatively, you can use the get music details
                      interface to poll task status
                    example: https://example.com/callback
            required: true
            requiredProperties:
              - uploadUrl
              - callBackUrl
              - prompt
              - title
              - negativeTags
              - style
        examples:
          example:
            value:
              prompt: A calm and relaxing piano track.
              model: V4_5PLUS
              title: Relaxing Piano
              negativeTags: heavy metal, strong drum beats
              style: Jazz
              vocalGender: m
              styleWeight: 0.61
              weirdnessConstraint: 0.72
              audioWeight: 0.65
              uploadUrl: https://example.com/music.mp3
              callBackUrl: https://example.com/callback
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
                      - 409
                      - 422
                      - 429
                      - 451
                      - 455
                      - 500
                    description: >-
                      Response status code


                      - **200**: Success - Request processed successfully

                      - **401**: Unauthorized - Authentication credentials
                      missing or invalid

                      - **402**: Insufficient credits - Account does not have
                      enough credits to perform this operation

                      - **404**: Not found - Requested resource or endpoint does
                      not exist

                      - **409**: Conflict - WAV record already exists

                      - **422**: Validation error - Request parameters failed
                      validation checks

                      - **429**: Rate limit exceeded - Request limit for this
                      resource has been exceeded

                      - **451**: Unauthorized - Failed to retrieve image. Please
                      verify any access restrictions set by you or your service
                      provider.

                      - **455**: Service unavailable - System currently
                      undergoing maintenance

                      - **500**: Server error - Unexpected error occurred while
                      processing request
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
                          Task ID for tracking task status. You can use this ID
                          to query task details and results through the "Get
                          Music Details" interface.
                        example: 5c79****be8e
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 5c79****be8e
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