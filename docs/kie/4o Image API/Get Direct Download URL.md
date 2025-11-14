# Get Direct Download URL

> Convert an image URL to a direct download URL. This helps solve cross-domain issues when downloading images directly. The returned URL is valid for 20 minutes.

## OpenAPI

````yaml 4o-image-api/4o-image-api.json post /api/v1/gpt4o-image/download-url
paths:
  path: /api/v1/gpt4o-image/download-url
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
                    description: The task ID associated with the image generation
                    example: task12345
              url:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      The original image URL that needs to be converted to a
                      direct download URL
                    example: https://tempfile.aiquickdraw.com/v/xxxxxxx.png
            required: true
            requiredProperties:
              - taskId
              - url
            example:
              taskId: task12345
              url: https://tempfile.aiquickdraw.com/v/xxxxxxx.png
        examples:
          example:
            value:
              taskId: task12345
              url: https://tempfile.aiquickdraw.com/v/xxxxxxx.png
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
                      - 451
                      - 455
                      - 500
                    description: >-
                      Response Status Codes


                      - **200**: Success - Request has been processed
                      successfully  

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid  

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist  

                      - **422**: Validation Error  
                        - The request parameters failed validation checks  
                        - record is null  
                        - Temporarily supports records within 14 days  
                        - record result data is blank  
                        - record status is not success  
                        - record result data not exist  
                        - record result data is empty  
                      - **451**: Failed to fetch the image. Kindly verify any
                      access limits set by you or your service provider  

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
                  - type: string
                    description: Direct download URL valid for 20 minutes
                    example: >-
                      https://xxxxxx.xxxxxxxx.r2.cloudflarestorage.com/v/xxxxxxx.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250415T101007Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Credential=2464206aa3e576aa7c035d889be3a84e%2F20250415%2Fapac%2Fs3%2Faws4_request&X-Amz-Signature=122ae8bef09110e620841ab2ef8061c1818e754fc201408a9d1c6847b36fd3df
        examples:
          example:
            value:
              code: 200
              msg: success
              data: >-
                https://xxxxxx.xxxxxxxx.r2.cloudflarestorage.com/v/xxxxxxx.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250415T101007Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Credential=2464206aa3e576aa7c035d889be3a84e%2F20250415%2Fapac%2Fs3%2Faws4_request&X-Amz-Signature=122ae8bef09110e620841ab2ef8061c1818e754fc201408a9d1c6847b36fd3df
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