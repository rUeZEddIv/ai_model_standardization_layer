# Generate 4o Image（GPT IMAG 1）

> Create a new 4o Image(gpt image 1) generation task. Generated images are stored for 14 days, after which they expire.

## OpenAPI

````yaml 4o-image-api/4o-image-api.json post /api/v1/gpt4o-image/generate
paths:
  path: /api/v1/gpt4o-image/generate
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
                      (Optional) Text prompt that conveys the creative idea you
                      want the 4o model to render. Required if neither
                      `filesUrl` nor `fileUrl` is supplied. At least one of
                      `prompt` or `filesUrl` must be provided.
                    example: A beautiful sunset over the mountains
              filesUrl:
                allOf:
                  - type: array
                    items:
                      type: string
                      format: uri
                    description: >-
                      (Optional) Up to 5 publicly reachable image URLs to serve
                      as reference or source material. Use this when you want to
                      edit or build upon an existing picture. If you don’t have
                      reliable hosting, upload your images first via our File
                      Upload API quick‑start:
                      https://docs.kie.ai/file-upload-api/quickstart. Supported
                      formats: .jfif, .pjpeg, .jpeg, .pjp, .jpg, .png, .webp. At
                      least one of `prompt` or `filesUrl` must be provided.
                    example:
                      - https://example.com/image1.png
                      - https://example.com/image2.jpg
              size:
                allOf:
                  - type: string
                    description: >-
                      (Required) Aspect ratio of the generated image. Must be
                      one of the listed values.
                    enum:
                      - '1:1'
                      - '3:2'
                      - '2:3'
                    example: '1:1'
              nVariants:
                allOf:
                  - type: integer
                    description: >-
                      (Optional) How many image variations to produce (1, 2,
                      or 4). Each option has a different credit cost—see
                      up‑to‑date pricing at https://kie.ai/billing. Default is
                      1.
                    enum:
                      - 1
                      - 2
                      - 4
                    example: 1
              maskUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      (Optional) Mask image URL indicating areas to modify
                      (black) versus preserve (white). The mask must match the
                      reference image’s dimensions and format (≤ 25 MB). When
                      more than one image is supplied in `filesUrl`, `maskUrl`
                      is ignored.


                      Example:

                      ![Mask
                      Example](https://static.aiquickdraw.com/images/docs/4o-gen-image-mask.png)


                      In the image above, the left side shows the original
                      image, the middle shows the mask image (white areas
                      indicate parts to be preserved, black areas indicate parts
                      to be modified), and the right side shows the final
                      generated image.
                    example: https://example.com/mask.png
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      The URL to receive 4o image generation task completion
                      updates. Optional but recommended for production use.


                      - System will POST task status and results to this URL
                      when 4o image generation completes

                      - Callback includes generated image URLs and task
                      information for all variations

                      - Your callback endpoint should accept POST requests with
                      JSON payload containing image generation results

                      - For detailed callback format and implementation guide,
                      see [4o Image Generation
                      Callbacks](./generate-4-o-image-callbacks)

                      - Alternatively, use the Get 4o Image Details endpoint to
                      poll task status
                    example: https://your-callback-url.com/callback
              isEnhance:
                allOf:
                  - type: boolean
                    description: >-
                      (Optional) Enable prompt enhancement for more refined
                      outputs in specialised scenarios (e.g., 3D renders).
                      Default false.
                    example: false
              uploadCn:
                allOf:
                  - type: boolean
                    description: >-
                      (Optional) Choose the upload region. `true` routes uploads
                      via China servers; `false` via non‑China servers.
                    example: false
              enableFallback:
                allOf:
                  - type: boolean
                    description: >-
                      (Optional) Activate automatic fallback to backup models
                      (e.g., Flux) if GPT‑4o image generation is unavailable.
                      Default false.
                    example: false
              fallbackModel:
                allOf:
                  - type: string
                    description: >-
                      (Optional) Specify which backup model to use when the main
                      model is unavailable. Takes effect when enableFallback is
                      true. Available values: GPT_IMAGE_1  or FLUX_MAX. Default
                      value is FLUX_MAX.
                    enum:
                      - GPT_IMAGE_1
                      - FLUX_MAX
                    default: FLUX_MAX
                    example: FLUX_MAX
              fileUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      (Optional, Deprecated) File URL, such as an image URL. If
                      fileUrl is provided, 4o image may create based on this
                      image. This parameter will be deprecated in the future,
                      please use filesUrl instead.
                    example: https://example.com/image.png
                    deprecated: true
            required: true
            requiredProperties:
              - size
            example:
              filesUrl:
                - https://example.com/image1.png
                - https://example.com/image2.png
              prompt: A beautiful sunset over the mountains
              size: '1:1'
              callBackUrl: https://your-callback-url.com/callback
              isEnhance: false
              uploadCn: false
              nVariants: 1
              enableFallback: false
              fallbackModel: FLUX_MAX
        examples:
          example:
            value:
              filesUrl:
                - https://example.com/image1.png
                - https://example.com/image2.png
              prompt: A beautiful sunset over the mountains
              size: '1:1'
              callBackUrl: https://your-callback-url.com/callback
              isEnhance: false
              uploadCn: false
              nVariants: 1
              enableFallback: false
              fallbackModel: FLUX_MAX
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
                      - 400
                      - 401
                      - 402
                      - 404
                      - 422
                      - 429
                      - 455
                      - 500
                      - 550
                    description: >-
                      Response Status Codes


                      - **200**: Success - Request has been processed
                      successfully  

                      - **400**: Format Error - The parameter is not in a valid
                      JSON format  

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid  

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation  

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
                        - Build Failed - vocal removal generation failed  
                      - **550**: Connection Denied - Task was rejected due to a
                      full queue, likely caused by source site's issues. Please
                      contact the administrator to confirm.
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
                          Task ID, can be used with [Get 4o Image
                          Details](/4o-image-api/get-4-o-image-details) to query
                          task status
                        example: task12345
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: task12345
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