# Generate MIDI from Audio

> Convert separated audio tracks into MIDI format with detailed note information for each instrument.

## OpenAPI

````yaml suno-api/suno-api.json post /api/v1/midi/generate
paths:
  path: /api/v1/midi/generate
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
                      Task ID from a completed vocal separation. This should be
                      the taskId returned from the Vocal & Instrument Stem
                      Separation endpoint.
                    example: 5c79****be8e
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      The URL to receive MIDI generation task completion
                      updates. Required for all MIDI generation requests.


                      - System will POST task status and MIDI note data to this
                      URL when generation completes

                      - Callback includes detailed note information for each
                      detected instrument with pitch, timing, and velocity

                      - Your callback endpoint should accept POST requests with
                      JSON payload containing MIDI data

                      - For detailed callback format and implementation guide,
                      see [MIDI Generation Callbacks](./generate-midi-callbacks)

                      - Alternatively, use the Get MIDI Generation Details
                      endpoint to poll task status
                    example: https://example.callback
            required: true
            requiredProperties:
              - taskId
              - callBackUrl
        examples:
          example:
            value:
              taskId: 5c79****be8e
              callBackUrl: https://example.callback
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    description: Response status code
                    example: 200
              msg:
                allOf:
                  - type: string
                    description: Response message
                    example: success
              data:
                allOf:
                  - type: object
                    description: Response data containing task information
                    properties:
                      taskId:
                        type: string
                        description: >-
                          Unique identifier for the MIDI generation task. Use
                          this to query task status or receive callback results.
                        example: 5c79****be8e
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 5c79****be8e
        description: MIDI generation task created successfully
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