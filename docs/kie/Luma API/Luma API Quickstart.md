# Luma API Quickstart

> Get started with the Luma API in minutes. Learn how to modify and transform videos using advanced AI models.

## Welcome to the Luma API!

This quickstart guide will walk you through the essential steps to start modifying videos using state-of-the-art AI models.

## Overview

<CardGroup cols={2}>
  <Card title="Video Modification" icon="video" href="/luma-api/generate-luma-modify-video">
    Transform existing videos with AI-powered modifications and enhancements
  </Card>

  <Card title="Task Tracking" icon="chart-line" href="/luma-api/get-luma-modify-details">
    Real-time status tracking and webhook callback notifications
  </Card>
</CardGroup>

<Info>
  Generated videos are processed asynchronously. Use callbacks or polling to track completion status.
</Info>

## Authentication

All API requests require authentication via Bearer Token.

<Steps>
  <Step title="Get Your API Key">
    Visit the [API Key Management Page](https://kie.ai/api-key) to obtain your API key.
  </Step>

  <Step title="Add to Request Headers">
    Include your API key in all requests:

    ```bash  theme={null}
    Authorization: Bearer YOUR_API_KEY
    ```
  </Step>
</Steps>

<Warning>
  Keep your API key secure and never share it publicly. If compromised, reset it immediately in the management page.
</Warning>

## Basic Usage

### 1. Modify an Existing Video

Start by creating your first video modification task:

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.kie.ai/api/v1/modify/generate" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures.",
      "videoUrl": "https://example.com/input-video.mp4",
      "callBackUrl": "https://your-callback-url.com/luma-callback"
    }'
  ```

  ```javascript Node.js theme={null}
  async function modifyVideo() {
    try {
      const response = await fetch('https://api.kie.ai/api/v1/modify/generate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures.',
          videoUrl: 'https://example.com/input-video.mp4',
          callBackUrl: 'https://your-callback-url.com/luma-callback'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        console.log('Task submitted:', result);
        console.log('Task ID:', result.data.taskId);
        return result.data.taskId;
      } else {
        console.error('Request failed:', result.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  }

  modifyVideo();
  ```

  ```python Python theme={null}
  import requests

  def modify_video():
      url = "https://api.kie.ai/api/v1/modify/generate"
      headers = {
          "Authorization": "Bearer YOUR_API_KEY",
          "Content-Type": "application/json"
      }
      data = {
          "prompt": "A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures.",
          "videoUrl": "https://example.com/input-video.mp4",
          "callBackUrl": "https://your-callback-url.com/luma-callback"
      }
      
      try:
          response = requests.post(url, headers=headers, json=data)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              print(f"Task submitted: {result}")
              print(f"Task ID: {result['data']['taskId']}")
              return result['data']['taskId']
          else:
              print(f"Request failed: {result.get('msg', 'Unknown error')}")
              return None
      except requests.exceptions.RequestException as e:
          print(f"Error: {e}")
          return None

  modify_video()
  ```
</CodeGroup>

**Response:**

```json  theme={null}
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "774d9a7dd608a0e49293903095e45a4c"
  }
}
```

### 2. Check Generation Status

Use the returned `taskId` to monitor progress:

<CodeGroup>
  ```bash cURL theme={null}
  curl -X GET "https://api.kie.ai/api/v1/modify/record-info?taskId=774d9a7dd608a0e49293903095e45a4c" \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```

  ```javascript Node.js theme={null}
  async function checkTaskStatus(taskId) {
    try {
      const response = await fetch(`https://api.kie.ai/api/v1/modify/record-info?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        const taskData = result.data;
        
        switch (taskData.successFlag) {
          case 0:
            console.log('Task is generating...');
            console.log('Create time:', taskData.createTime);
            return taskData;
            
          case 1:
            console.log('Task generation completed!');
            console.log('Result videos:', taskData.response?.resultUrls);
            console.log('Original videos:', taskData.response?.originUrls);
            console.log('Complete time:', taskData.completeTime);
            return taskData;
            
          case 2:
            console.log('Task creation failed');
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            if (taskData.errorCode) {
              console.error('Error code:', taskData.errorCode);
            }
            return taskData;
            
          case 3:
            console.log('Task created successfully but generation failed');
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            if (taskData.errorCode) {
              console.error('Error code:', taskData.errorCode);
            }
            return taskData;
            
          case 4:
            console.log('Generation succeeded but callback failed');
            console.log('Result videos:', taskData.response?.resultUrls);
            console.log('Original videos:', taskData.response?.originUrls);
            if (taskData.errorMessage) {
              console.error('Callback error:', taskData.errorMessage);
            }
            return taskData;
            
          default:
            console.log('Unknown status:', taskData.successFlag);
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            return taskData;
        }
      } else {
        console.error('Query failed:', result.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Status check failed:', error.message);
      return null;
    }
  }

  // Usage
  const status = await checkTaskStatus('774d9a7dd608a0e49293903095e45a4c');
  ```

  ```python Python theme={null}
  import requests

  def check_task_status(task_id):
      url = f"https://api.kie.ai/api/v1/modify/record-info?taskId={task_id}"
      headers = {"Authorization": "Bearer YOUR_API_KEY"}
      
      try:
          response = requests.get(url, headers=headers)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              task_data = result['data']
              success_flag = task_data['successFlag']
              
              if success_flag == 0:
                  print("Task is generating...")
                  print(f"Create time: {task_data.get('createTime', '')}")
                  return task_data
              elif success_flag == 1:
                  print("Task generation completed!")
                  response_data = task_data.get('response', {})
                  print(f"Result videos: {response_data.get('resultUrls', [])}")
                  print(f"Original videos: {response_data.get('originUrls', [])}")
                  print(f"Complete time: {task_data.get('completeTime', '')}")
                  return task_data
              elif success_flag == 2:
                  print("Task creation failed")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  if task_data.get('errorCode'):
                      print(f"Error code: {task_data['errorCode']}")
                  return task_data
              elif success_flag == 3:
                  print("Task created successfully but generation failed")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  if task_data.get('errorCode'):
                      print(f"Error code: {task_data['errorCode']}")
                  return task_data
              elif success_flag == 4:
                  print("Generation succeeded but callback failed")
                  response_data = task_data.get('response', {})
                  print(f"Result videos: {response_data.get('resultUrls', [])}")
                  print(f"Original videos: {response_data.get('originUrls', [])}")
                  if task_data.get('errorMessage'):
                      print(f"Callback error: {task_data['errorMessage']}")
                  return task_data
              else:
                  print(f"Unknown status: {success_flag}")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  return task_data
          else:
              print(f"Query failed: {result.get('msg', 'Unknown error')}")
              return None
      except requests.exceptions.RequestException as e:
          print(f"Status check failed: {e}")
          return None

  # Usage
  status = check_task_status('774d9a7dd608a0e49293903095e45a4c')
  ```
</CodeGroup>

**Status Values:**

* `0`: GENERATING - Task is currently being processed
* `1`: SUCCESS - Task completed successfully
* `2`: CREATE\_TASK\_FAILED - Failed to create the task
* `3`: GENERATE\_FAILED - Task creation succeeded but generation failed
* `4`: CALLBACK\_FAILED - Generation succeeded but callback failed

## Complete Workflow Example

Here's a complete example that modifies a video and waits for completion:

<Tabs>
  <Tab title="JavaScript">
    ```javascript  theme={null}
    class LumaAPI {
      constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.kie.ai/api/v1/modify';
      }
      
      async modifyVideo(prompt, videoUrl, options = {}) {
        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            videoUrl,
            callBackUrl: options.callBackUrl,
            watermark: options.watermark,
            ...options
          })
        });
        
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
          throw new Error(`Generation failed: ${result.msg || 'Unknown error'}`);
        }
        
        return result.data.taskId;
      }
      
      async waitForCompletion(taskId, maxWaitTime = 900000) { // 15 minutes max
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
          const status = await this.getTaskStatus(taskId);
          
          switch (status.successFlag) {
            case 0:
              console.log('Task is generating, continue waiting...');
              break;
              
            case 1:
              console.log('Generation completed successfully!');
              return status.response;
              
            case 4:
              console.log('Generation succeeded but callback failed');
              return status.response;
              
            case 2:
              const createError = status.errorMessage || 'Task creation failed';
              console.error('Task creation failed:', createError);
              if (status.errorCode) {
                console.error('Error code:', status.errorCode);
              }
              throw new Error(createError);
              
            case 3:
              const generateError = status.errorMessage || 'Task created successfully but generation failed';
              console.error('Generation failed:', generateError);
              if (status.errorCode) {
                console.error('Error code:', status.errorCode);
              }
              throw new Error(generateError);
              
            default:
              console.log(`Unknown status: ${status.successFlag}`);
              if (status.errorMessage) {
                console.error('Error message:', status.errorMessage);
              }
              break;
          }
          
          // Wait 10 seconds before next check
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
        throw new Error('Generation timeout');
      }
      
      async getTaskStatus(taskId) {
        const response = await fetch(`${this.baseUrl}/record-info?taskId=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
          throw new Error(`Status check failed: ${result.msg || 'Unknown error'}`);
        }
        
        return result.data;
      }
    }

    // Usage Example
    async function main() {
      const api = new LumaAPI('YOUR_API_KEY');
      
      try {
        // Video Modification
        console.log('Starting video modification...');
        const taskId = await api.modifyVideo(
          'A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures. Holographic advertisements flicker and change on building facades.',
          'https://example.com/input-video.mp4',
          { 
            callBackUrl: 'https://your-callback-url.com/luma-callback',
            watermark: 'your-watermark-id'
          }
        );
        
        // Wait for completion
        console.log(`Task ID: ${taskId}. Waiting for completion...`);
        const result = await api.waitForCompletion(taskId);
        
        console.log('Video modified successfully!');
        console.log('Result Video URLs:', result.resultUrls);
        console.log('Original Video URLs:', result.originUrls);
        
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    main();
    ```
  </Tab>

  <Tab title="Python">
    ```python  theme={null}
    import requests
    import time

    class LumaAPI:
        def __init__(self, api_key):
            self.api_key = api_key
            self.base_url = 'https://api.kie.ai/api/v1/modify'
            self.headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
        
        def modify_video(self, prompt, video_url, **options):
            data = {
                'prompt': prompt,
                'videoUrl': video_url,
                'callBackUrl': options.get('callBackUrl'),
                'watermark': options.get('watermark'),
                **options
            }
            
            # Remove None values
            data = {k: v for k, v in data.items() if v is not None}
            
            response = requests.post(f'{self.base_url}/generate', 
                                   headers=self.headers, json=data)
            result = response.json()
            
            if not response.ok or result.get('code') != 200:
                raise Exception(f"Generation failed: {result.get('msg', 'Unknown error')}")
            
            return result['data']['taskId']
        
        def wait_for_completion(self, task_id, max_wait_time=900):
            start_time = time.time()
            
            while time.time() - start_time < max_wait_time:
                status = self.get_task_status(task_id)
                success_flag = status['successFlag']
                
                if success_flag == 0:
                    print("Task is generating, continue waiting...")
                elif success_flag == 1:
                    print("Generation completed successfully!")
                    return status['response']
                elif success_flag == 4:
                    print("Generation succeeded but callback failed")
                    return status['response']
                elif success_flag == 2:
                    create_error = status.get('errorMessage', 'Task creation failed')
                    print(f"Task creation failed: {create_error}")
                    if status.get('errorCode'):
                        print(f"Error code: {status['errorCode']}")
                    raise Exception(create_error)
                elif success_flag == 3:
                    generate_error = status.get('errorMessage', 'Task created successfully but generation failed')
                    print(f"Generation failed: {generate_error}")
                    if status.get('errorCode'):
                        print(f"Error code: {status['errorCode']}")
                    raise Exception(generate_error)
                else:
                    print(f"Unknown status: {success_flag}")
                    if status.get('errorMessage'):
                        print(f"Error message: {status['errorMessage']}")
                
                time.sleep(10)  # Wait 10 seconds
            
            raise Exception('Generation timeout')
        
        def get_task_status(self, task_id):
            response = requests.get(f'{self.base_url}/record-info?taskId={task_id}',
                                  headers={'Authorization': f'Bearer {self.api_key}'})
            result = response.json()
            
            if not response.ok or result.get('code') != 200:
                raise Exception(f"Status check failed: {result.get('msg', 'Unknown error')}")
            
            return result['data']

    # Usage Example
    def main():
        api = LumaAPI('YOUR_API_KEY')
        
        try:
            # Video Modification
            print('Starting video modification...')
            task_id = api.modify_video(
                'A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures. Holographic advertisements flicker and change on building facades.',
                'https://example.com/input-video.mp4',
                callBackUrl='https://your-callback-url.com/luma-callback',
                watermark='your-watermark-id'
            )
            
            # Wait for completion
            print(f'Task ID: {task_id}. Waiting for completion...')
            result = api.wait_for_completion(task_id)
            
            print('Video modified successfully!')
            print(f'Result Video URLs: {result["resultUrls"]}')
            print(f'Original Video URLs: {result["originUrls"]}')
            
            # Download videos
            for i, url in enumerate(result['resultUrls']):
                filename = f'modified_video_{i+1}.mp4'
                download_video(url, filename)
            
        except Exception as error:
            print(f'Error: {error}')

    def download_video(url, filename):
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f'Downloaded: {filename}')

    if __name__ == '__main__':
        main()
    ```
  </Tab>
</Tabs>

## Advanced Features

### Watermark Support

Add watermarks to your generated videos:

```javascript  theme={null}
const taskId = await api.modifyVideo(
  'Transform this scene into a magical forest',
  'https://example.com/input-video.mp4',
  {
    watermark: 'your-brand-watermark'
  }
);
```

### Using Callbacks

Set up webhook callbacks for automatic notifications:

```javascript  theme={null}
const taskId = await api.modifyVideo(
  'Create a dramatic sunset transformation',
  'https://example.com/input-video.mp4',
  {
    callBackUrl: 'https://your-server.com/luma-callback'
  }
);

// Your callback endpoint will receive:
app.post('/luma-callback', (req, res) => {
  const { code, data } = req.body;
  
  if (code === 200) {
    console.log('Videos ready:', data.resultUrls);
  } else {
    console.log('Generation failed:', req.body.msg);
  }
  
  res.status(200).json({ status: 'received' });
});
```

<Card title="Learn More About Callbacks" icon="webhook" href="/luma-api/generate-luma-modify-video-callbacks">
  Set up webhook callbacks to receive automatic notifications when your videos are ready.
</Card>

## Error Handling

Common error scenarios and how to handle them:

<AccordionGroup>
  <Accordion title="Invalid Video URL (Code 422)">
    ```javascript  theme={null}
    try {
      const taskId = await api.modifyVideo('prompt', 'invalid-url');
    } catch (error) {
      if (error.data.code === 422) {
        console.log('Please provide a valid, accessible video URL');
      }
    }
    ```
  </Accordion>

  <Accordion title="Generation Failed (Code 501)">
    ```javascript  theme={null}
    try {
      const result = await api.waitForCompletion(taskId);
    } catch (error) {
      console.log('Generation failed. Try adjusting your prompt or video input');
    }
    ```
  </Accordion>

  <Accordion title="Rate Limiting (Code 429)">
    ```javascript  theme={null}
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function generateWithRetry(prompt, videoUrl, options, maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await api.modifyVideo(prompt, videoUrl, options);
        } catch (error) {
          if (error.data.code === 429 && i < maxRetries - 1) {
            await delay(Math.pow(2, i) * 1000); // Exponential backoff
            continue;
          }
          throw error;
        }
      }
    }
    ```
  </Accordion>
</AccordionGroup>

## Best Practices

<Tip>
  ### Performance Optimization

  1. **Use Callbacks**: Set up webhook callbacks instead of polling for better performance
  2. **Prompt Engineering**: Use detailed, specific prompts for better results
  3. **Video Preprocessing**: Ensure input videos are optimized and accessible
  4. **Download Management**: Download generated videos promptly as they may expire
  5. **Error Handling**: Implement robust error handling and retry logic
</Tip>

<Warning>
  ### Important Limitations

  * **Language Support**: Prompts only support English
  * **Video Storage**: Generated videos may expire after a certain period
  * **File Size**: Maximum video size is 500MB
  * **Duration**: Maximum video duration is 10 seconds
  * **Input Videos**: Must be publicly accessible URLs
  * **Processing Time**: Video generation can take several minutes
</Warning>

## Supported Parameters

### Core Parameters

| Parameter  | Type   | Description                                           | Required |
| ---------- | ------ | ----------------------------------------------------- | -------- |
| `prompt`   | string | **Required**. Text description for video modification | ✓        |
| `videoUrl` | string | **Required**. URL of input video for modification     | ✓        |

### Optional Parameters

| Parameter     | Type   | Description              | Default |
| ------------- | ------ | ------------------------ | ------- |
| `callBackUrl` | string | Webhook notification URL | -       |
| `watermark`   | string | Watermark identifier     | -       |

## Task Status Descriptions

<ResponseField name="successFlag: 0" type="Generating">
  Task is currently being processed
</ResponseField>

<ResponseField name="successFlag: 1" type="Success">
  Task completed successfully
</ResponseField>

<ResponseField name="successFlag: 2" type="Create Task Failed">
  Failed to create the task
</ResponseField>

<ResponseField name="successFlag: 3" type="Generate Failed">
  Task creation succeeded but generation failed
</ResponseField>

<ResponseField name="successFlag: 4" type="Callback Failed">
  Generation succeeded but callback failed
</ResponseField>

## Next Steps

<CardGroup cols={2}>
  <Card title="Generate Video Modifications" icon="video" href="/luma-api/generate-luma-modify-video">
    Learn about all generation parameters and advanced options
  </Card>

  <Card title="Track Progress" icon="chart-line" href="/luma-api/get-luma-modify-details">
    Monitor task status and retrieve detailed generation information
  </Card>

  <Card title="Webhook Callbacks" icon="webhook" href="/luma-api/generate-luma-modify-video-callbacks">
    Set up automatic notifications for task completion
  </Card>
</CardGroup>

## Support

Need help? Here are your options:

* **Technical Support**: [support@kie.ai](mailto:support@kie.ai)
* **API Status**: Monitor service health and announcements
* **Documentation**: Explore detailed API references
* **Community**: Join our developer community for tips and examples

Ready to create amazing AI-modified videos? Start with the examples above and explore the full API capabilities!
