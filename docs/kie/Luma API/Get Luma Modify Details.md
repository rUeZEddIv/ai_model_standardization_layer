# Get Luma Modify Details

> Query the status and results of a Luma modify video generation task.

## OpenAPI

````yaml luma-api/luma-api.json get /api/v1/modify/record-info
paths:
  path: /api/v1/modify/record-info
  method: get
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
      query:
        taskId:
          schema:
            - type: string
              required: true
              description: Unique identifier of the video generation task
      header: {}
      cookie: {}
    body: {}
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
                      - 455
                      - 500
                      - 501
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

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request

                      - **501**: Generation Failed - Video generation task
                      failed
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
                        description: Unique identifier of the video generation task
                        example: 774d9a7dd608a0e49293903095e45a4c
                      paramJson:
                        type: string
                        description: Request parameters in JSON format
                        example: >-
                          {"callBackUrl":"https://example.com/callback","prompt":"A
                          futuristic
                          cityscape","videoUrl":"https://example.com/video.mp4","waterMark":""}
                      completeTime:
                        type: integer
                        format: int64
                        description: Task completion time (Unix timestamp in milliseconds)
                        example: 1755078480000
                      response:
                        type: object
                        description: Final result (only present when task is completed)
                        properties:
                          taskId:
                            type: string
                            description: Task ID
                            example: 774d9a7dd608a0e49293903095e45a4c
                          originUrls:
                            type: array
                            items:
                              type: string
                            description: Original video URLs
                            example:
                              - >-
                                https://tempfile.aiquickdraw.com/kieai/file/veo3-video/1755074605154fqb0m8ge.mp4
                          resultUrls:
                            type: array
                            items:
                              type: string
                            description: Generated video URLs
                            example:
                              - >-
                                https://tempfile.aiquickdraw.com/l/f782018c-6be4-4990-96ba-7231cd5a39e7.mp4
                      successFlag:
                        type: integer
                        description: Generation status flag
                        enum:
                          - 0
                          - 1
                          - 2
                          - 3
                          - 4
                        example: 1
                      createTime:
                        type: integer
                        format: int64
                        description: Task creation time (Unix timestamp in milliseconds)
                        example: 1755078171000
                      errorCode:
                        type: integer
                        description: Error code if task failed
                        example: null
                      errorMessage:
                        type: string
                        description: Error message if task failed
                        example: null
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 774d9a7dd608a0e49293903095e45a4c
                paramJson: >-
                  {"callBackUrl":"https://example.com/callback","prompt":"A
                  futuristic
                  cityscape","videoUrl":"https://example.com/video.mp4","waterMark":""}
                completeTime: 1755078480000
                response:
                  taskId: 774d9a7dd608a0e49293903095e45a4c
                  originUrls:
                    - >-
                      https://tempfile.aiquickdraw.com/kieai/file/veo3-video/1755074605154fqb0m8ge.mp4
                  resultUrls:
                    - >-
                      https://tempfile.aiquickdraw.com/l/f782018c-6be4-4990-96ba-7231cd5a39e7.mp4
                successFlag: 1
                createTime: 1755078171000
                errorCode: null
                errorMessage: null
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