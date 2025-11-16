# Get MIDI Generation Details

> Retrieve detailed information about a MIDI generation task including complete note data for all detected instruments.

## OpenAPI

````yaml suno-api/suno-api.json get /api/v1/midi/record-info
paths:
  path: /api/v1/midi/record-info
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
              description: The task ID returned from the MIDI generation request
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
                    description: MIDI generation task details
                    properties:
                      taskId:
                        type: string
                        description: MIDI generation task ID
                      recordTaskId:
                        type: integer
                        description: Internal record task ID
                      audioId:
                        type: string
                        description: Audio ID from the vocal separation task
                      callbackUrl:
                        type: string
                        description: Callback URL provided when creating the task
                      completeTime:
                        type: integer
                        description: Task completion timestamp (milliseconds)
                      midiData:
                        type: object
                        description: >-
                          Complete MIDI data containing detected instruments and
                          notes
                        properties:
                          state:
                            type: string
                            description: Processing state
                            example: complete
                          instruments:
                            type: array
                            description: >-
                              Array of detected instruments with their MIDI
                              notes
                            items:
                              type: object
                              properties:
                                name:
                                  type: string
                                  description: Instrument name
                                notes:
                                  type: array
                                  description: Array of MIDI notes for this instrument
                                  items:
                                    type: object
                                    properties:
                                      pitch:
                                        type: integer
                                        description: MIDI note number (0-127)
                                      start:
                                        type: number
                                        description: Note start time in seconds
                                      end:
                                        type: number
                                        description: Note end time in seconds
                                      velocity:
                                        type: number
                                        description: Note velocity/intensity (0-1)
                      successFlag:
                        type: integer
                        description: >-
                          Task status flag: 0 = Pending, 1 = Success, 2 = Failed
                          to create task, 3 = MIDI generation failed
                      createTime:
                        type: integer
                        description: Task creation timestamp (milliseconds)
                      errorCode:
                        type: string
                        nullable: true
                        description: Error code if task failed
                      errorMessage:
                        type: string
                        nullable: true
                        description: Error message if task failed
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 5c79****be8e
                recordTaskId: -1
                audioId: e231****-****-****-****-****8cadc7dc
                callbackUrl: https://example.callback
                completeTime: 1760335255000
                midiData:
                  state: complete
                  instruments:
                    - name: Drums
                      notes:
                        - pitch: 73
                          start: 0.036458333333333336
                          end: 0.18229166666666666
                          velocity: 1
                        - pitch: 61
                          start: 0.046875
                          end: 0.19270833333333334
                          velocity: 1
                    - name: Electric Bass (finger)
                      notes:
                        - pitch: 44
                          start: 7.6875
                          end: 7.911458333333333
                          velocity: 1
                successFlag: 1
                createTime: 1760335251000
                errorCode: null
                errorMessage: null
        description: MIDI generation task details retrieved successfully
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