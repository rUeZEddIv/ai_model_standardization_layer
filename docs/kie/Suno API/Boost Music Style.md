# Boost Music Style

## OpenAPI

````yaml suno-api/suno-api.json post /api/v1/style/generate
paths:
  path: /api/v1/style/generate
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
              content:
                allOf:
                  - type: string
                    description: >-
                      Style description. Please describe in concise and clear
                      language the music style you expect to generate. Example:
                      'Pop, Mysterious'
                    example: Pop, Mysterious
            required: true
            requiredProperties:
              - content
        examples:
          example:
            value:
              content: Pop, Mysterious
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


                      - **200**: Success - Request has been processed
                      successfully

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **409**: Conflict - WAV record already exists

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
                      taskId:
                        type: string
                        description: Task ID
                      param:
                        type: string
                        description: Request parameters
                      result:
                        type: string
                        description: The final generated music style text result.
                      creditsConsumed:
                        type: number
                        description: >-
                          Credits consumed, up to 5 digits, up to 2 decimal
                          places
                      creditsRemaining:
                        type: number
                        description: Credits remaining after this task
                      successFlag:
                        type: string
                        description: 'Execution result: 0-pending, 1-success, 2-failed'
                      errorCode:
                        type: integer
                        format: int32
                        description: >-
                          Error code


                          - **400**: Validation Error - Failed, The request
                          parameters failed validation checks.
                        enum:
                          - 400
                      errorMessage:
                        type: string
                        description: Error message
                        example: ''
                      createTime:
                        type: string
                        description: Creation time
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: <string>
                param: <string>
                result: <string>
                creditsConsumed: 123
                creditsRemaining: 123
                successFlag: <string>
                errorCode: 400
                errorMessage: ''
                createTime: <string>
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