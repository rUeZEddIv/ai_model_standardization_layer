# Get Timestamped Lyrics

> Retrieve synchronized lyrics with precise timestamps for music tracks.

## OpenAPI

````yaml suno-api/suno-api.json post /api/v1/generate/get-timestamped-lyrics
paths:
  path: /api/v1/generate/get-timestamped-lyrics
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
              taskId:
                allOf:
                  - type: string
                    description: >-
                      Unique identifier of the music generation task. This
                      should be a taskId returned from either the "Generate
                      Music" or "Extend Music" endpoints.
                    example: 5c79****be8e
              audioId:
                allOf:
                  - type: string
                    description: >-
                      Unique identifier of the specific audio track for which to
                      retrieve lyrics. This ID is returned in the callback data
                      after music generation completes.
                    example: e231****-****-****-****-****8cadc7dc
            required: true
            requiredProperties:
              - taskId
              - audioId
        examples:
          example:
            value:
              taskId: 5c79****be8e
              audioId: e231****-****-****-****-****8cadc7dc
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
                      - 404
                      - 422
                      - 429
                      - 451
                      - 455
                      - 500
                    description: >-
                      Response status code


                      - **200**: Success - Request has been processed
                      successfully

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **451**: Unauthorized - Failed to fetch the image.
                      Kindly verify any access limits set by you or your service
                      provider.

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      alignedWords:
                        type: array
                        description: List of aligned lyrics words
                        items:
                          type: object
                          properties:
                            word:
                              type: string
                              description: Lyrics word
                              example: |-
                                [Verse]
                                Waggin'
                            success:
                              type: boolean
                              description: Whether lyrics word is successfully aligned
                              example: true
                            startS:
                              type: number
                              description: Word start time (seconds)
                              example: 1.36
                            endS:
                              type: number
                              description: Word end time (seconds)
                              example: 1.79
                            palign:
                              type: integer
                              description: Alignment parameter
                              example: 0
                      waveformData:
                        type: array
                        description: Waveform data, used for audio visualization
                        items:
                          type: number
                        example:
                          - 0
                          - 1
                          - 0.5
                          - 0.75
                      hootCer:
                        type: number
                        description: Lyrics alignment accuracy score
                        example: 0.3803191489361702
                      isStreamed:
                        type: boolean
                        description: Whether it's streaming audio
                        example: false
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                alignedWords:
                  - word: |-
                      [Verse]
                      Waggin'
                    success: true
                    startS: 1.36
                    endS: 1.79
                    palign: 0
                waveformData:
                  - 0
                  - 1
                  - 0.5
                  - 0.75
                hootCer: 0.3803191489361702
                isStreamed: false
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