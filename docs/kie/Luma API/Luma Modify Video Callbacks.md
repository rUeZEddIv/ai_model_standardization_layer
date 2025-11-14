# Luma Modify Video Callbacks

> When the video generation task is completed, the system will send the result to your provided callback URL via POST request

When you submit a video modification task to the Luma API, you can use the `callBackUrl` parameter to set a callback URL. The system will automatically push the results to your specified address when the task is completed.

## Callback Mechanism Overview

<Info>
  The callback mechanism eliminates the need to poll the API for task status. The system will proactively push task completion results to your server.
</Info>

### Callback Timing

The system will send callback notifications in the following situations:

* Video modification task completed successfully
* Video modification task failed
* Errors occurred during task processing

### Callback Method

* **HTTP Method**: POST
* **Content Type**: application/json
* **Timeout Setting**: 15 seconds

## Callback Request Format

When the task is completed, the system will send a POST request to your `callBackUrl` in the following format:

<CodeGroup>
  ```json Success Callback theme={null}
  {
    "code": 200,
    "msg": "Modify record generated successfully.",
    "data": {
      "taskId": "774d9a7dd608a0e49293903095e45a4c",
      "promptJson": "{\"callBackUrl\":\"https://b7af305f36d6.ngrok-free.app/api/v1/modify/test\",\"prompt\":\"A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures. Holographic advertisements flicker and change on building facades.\",\"videoUrl\":\"https://tempfile.aiquickdraw.com/kieai/file/veo3-video/1755074605154fqb0m8ge.mp4\",\"waterMark\":\"\"}",
      "resultUrls": [
        "https://tempfile.aiquickdraw.com/l/f782018c-6be4-4990-96ba-7231cd5a39e7.mp4"
      ]
    }
  }
  ```

  ```json Generation Failure Callback theme={null}
  {
    "code": 500,
    "msg": "Modify record generation failed.",
    "data": {
      "taskId": "774d9a7dd608a0e49293903095e45a4c",
      "promptJson": "{\"callBackUrl\":\"https://b7af305f36d6.ngrok-free.app/api/v1/modify/test\",\"prompt\":\"A futuristic cityscape at night with towering glass spires reaching into a starry sky. Neon lights in blue and purple illuminate the buildings while flying vehicles glide silently between the structures. Holographic advertisements flicker and change on building facades.\",\"videoUrl\":\"https://tempfile.aiquickdraw.com/kieai/file/veo3-video/1755074605154fqb0m8ge.mp4\",\"waterMark\":\"\"}"
    }
  }
  ```
</CodeGroup>

## Status Code Description

<ParamField path="code" type="integer" required>
  Callback status code indicating task processing result:

  | Status Code | Description                                         |
  | ----------- | --------------------------------------------------- |
  | 200         | Success - Video modification completed successfully |
  | 500         | Failed - Video modification task failed             |
</ParamField>

<ParamField path="msg" type="string" required>
  Status message providing detailed status description
</ParamField>

<ParamField path="data.taskId" type="string" required>
  Task ID, consistent with the taskId returned when you submitted the task
</ParamField>

<ParamField path="data.promptJson" type="string" required>
  Original request parameters in JSON format, including the prompt, video URL, callback URL, and watermark settings
</ParamField>

<ParamField path="data.resultUrls" type="array">
  Generated video URLs. Only present on successful completion (code 200).
</ParamField>

## Callback Reception Examples

Here are example codes for receiving callbacks in popular programming languages:

<Tabs>
  <Tab title="Node.js">
    ```javascript  theme={null}
    const express = require('express');
    const fs = require('fs');
    const https = require('https');
    const app = express();

    app.use(express.json());

    app.post('/luma-modify-callback', (req, res) => {
      const { code, msg, data } = req.body;
      
      console.log('Received Luma video modification callback:', {
        taskId: data.taskId,
        status: code,
        message: msg
      });
      
      if (code === 200) {
        // Task completed successfully
        console.log('Luma video modification completed successfully');
        
        const { taskId, promptJson, resultUrls } = data;
        
        console.log(`Task ID: ${taskId}`);
        console.log(`Original Parameters: ${promptJson}`);
        console.log(`Generated Video URLs: ${resultUrls.join(', ')}`);
        
        // Download generated videos
        resultUrls.forEach((url, index) => {
          const filename = `luma_result_${taskId}_${index + 1}.mp4`;
          downloadFile(url, filename)
            .then(() => console.log(`Video ${index + 1} downloaded successfully`))
            .catch(err => console.error(`Video ${index + 1} download failed:`, err));
        });
        
      } else {
        // Task failed
        console.log('Luma video modification failed:', msg);
        
        // Log original parameters for debugging
        const { promptJson } = data;
        console.log('Original parameters:', promptJson);
        
        // Handle specific error cases
        console.log('Please check your input video and prompt, then try again');
      }
      
      // Return 200 status code to confirm callback received
      res.status(200).json({ status: 'received' });
    });

    // Helper function to download files
    function downloadFile(url, filename) {
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          } else {
            reject(new Error(`HTTP ${response.statusCode}`));
          }
        }).on('error', reject);
      });
    }

    app.listen(3000, () => {
      console.log('Luma callback server running on port 3000');
    });
    ```
  </Tab>

  <Tab title="Python">
    ```python  theme={null}
    from flask import Flask, request, jsonify
    import requests
    import os
    import json

    app = Flask(__name__)

    @app.route('/luma-modify-callback', methods=['POST'])
    def handle_callback():
        data = request.json
        
        code = data.get('code')
        msg = data.get('msg')
        callback_data = data.get('data', {})
        task_id = callback_data.get('taskId')
        prompt_json = callback_data.get('promptJson')
        result_urls = callback_data.get('resultUrls', [])
        
        print(f"Received Luma video modification callback:")
        print(f"Task ID: {task_id}")
        print(f"Status: {code}, Message: {msg}")
        
        if code == 200:
            # Task completed successfully
            print("Luma video modification completed successfully")
            
            print(f"Task ID: {task_id}")
            print(f"Original Parameters: {prompt_json}")
            print(f"Generated Video URLs: {', '.join(result_urls)}")
            
            # Parse original parameters
            try:
                original_params = json.loads(prompt_json)
                print(f"Original Prompt: {original_params.get('prompt', 'N/A')}")
                print(f"Original Video URL: {original_params.get('videoUrl', 'N/A')}")
            except json.JSONDecodeError:
                print("Could not parse original parameters")
            
            # Download generated videos
            for index, url in enumerate(result_urls):
                try:
                    filename = f"luma_result_{task_id}_{index + 1}.mp4"
                    download_file(url, filename)
                    print(f"Video {index + 1} downloaded as {filename}")
                except Exception as e:
                    print(f"Video {index + 1} download failed: {e}")
                    
        else:
            # Task failed
            print(f"Luma video modification failed: {msg}")
            
            # Log original parameters for debugging
            print(f"Original parameters: {prompt_json}")
            
            # Handle specific error cases
            print("Please check your input video and prompt, then try again")
        
        # Return 200 status code to confirm callback received
        return jsonify({'status': 'received'}), 200

    def download_file(url, filename):
        """Download file from URL and save locally"""
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        os.makedirs('downloads', exist_ok=True)
        filepath = os.path.join('downloads', filename)
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=3000)
    ```
  </Tab>

  <Tab title="PHP">
    ```php  theme={null}
    <?php
    header('Content-Type: application/json');

    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $code = $data['code'] ?? null;
    $msg = $data['msg'] ?? '';
    $callbackData = $data['data'] ?? [];
    $taskId = $callbackData['taskId'] ?? '';
    $promptJson = $callbackData['promptJson'] ?? '';
    $resultUrls = $callbackData['resultUrls'] ?? [];

    error_log("Received Luma video modification callback:");
    error_log("Task ID: $taskId");
    error_log("Status: $code, Message: $msg");

    if ($code === 200) {
        // Task completed successfully
        error_log("Luma video modification completed successfully");
        
        error_log("Task ID: $taskId");
        error_log("Original Parameters: $promptJson");
        error_log("Generated Video URLs: " . implode(', ', $resultUrls));
        
        // Parse original parameters
        $originalParams = json_decode($promptJson, true);
        if ($originalParams) {
            error_log("Original Prompt: " . ($originalParams['prompt'] ?? 'N/A'));
            error_log("Original Video URL: " . ($originalParams['videoUrl'] ?? 'N/A'));
        }
        
        // Download generated videos
        foreach ($resultUrls as $index => $url) {
            try {
                $filename = "luma_result_{$taskId}_" . ($index + 1) . ".mp4";
                downloadFile($url, $filename);
                error_log("Video " . ($index + 1) . " downloaded as $filename");
            } catch (Exception $e) {
                error_log("Video " . ($index + 1) . " download failed: " . $e->getMessage());
            }
        }
        
    } else {
        // Task failed
        error_log("Luma video modification failed: $msg");
        
        // Log original parameters for debugging
        error_log("Original parameters: $promptJson");
        
        // Handle specific error cases
        error_log("Please check your input video and prompt, then try again");
    }

    // Return 200 status code to confirm callback received
    http_response_code(200);
    echo json_encode(['status' => 'received']);

    function downloadFile($url, $filename) {
        $downloadDir = 'downloads';
        if (!is_dir($downloadDir)) {
            mkdir($downloadDir, 0755, true);
        }
        
        $filepath = $downloadDir . '/' . $filename;
        
        $fileContent = file_get_contents($url);
        if ($fileContent === false) {
            throw new Exception("Failed to download file from URL");
        }
        
        $result = file_put_contents($filepath, $fileContent);
        if ($result === false) {
            throw new Exception("Failed to save file locally");
        }
    }
    ?>
    ```
  </Tab>
</Tabs>

## Best Practices

<Tip>
  ### Callback URL Configuration Recommendations

  1. **Use HTTPS**: Ensure your callback URL uses HTTPS protocol for secure data transmission
  2. **Verify Source**: Verify the legitimacy of the request source in callback processing
  3. **Idempotent Processing**: The same taskId may receive multiple callbacks, ensure processing logic is idempotent
  4. **Quick Response**: Callback processing should return a 200 status code as quickly as possible to avoid timeout
  5. **Asynchronous Processing**: Complex business logic should be processed asynchronously to avoid blocking callback response
  6. **Timely Download**: Download generated videos promptly as they may expire after some time
</Tip>

<Warning>
  ### Important Reminders

  * Callback URL must be a publicly accessible address
  * Server must respond within 15 seconds, otherwise it will be considered a timeout
  * If 3 consecutive retries fail, the system will stop sending callbacks
  * **Generated video URLs may expire** - download immediately upon receiving callback
  * Please ensure the stability of callback processing logic to avoid callback failures due to exceptions
  * Need to handle both success and failure status codes for complete error handling
  * Large video files may take time to download - implement appropriate timeout settings
</Warning>

## Troubleshooting

If you do not receive callback notifications, please check the following:

<AccordionGroup>
  <Accordion title="Network Connection Issues">
    * Confirm that the callback URL is accessible from the public network
    * Check firewall settings to ensure inbound requests are not blocked
    * Verify that domain name resolution is correct
  </Accordion>

  <Accordion title="Server Response Issues">
    * Ensure the server returns HTTP 200 status code within 15 seconds
    * Check server logs for error messages
    * Verify that the interface path and HTTP method are correct
  </Accordion>

  <Accordion title="Content Format Issues">
    * Confirm that the received POST request body is in JSON format
    * Check that Content-Type is application/json
    * Verify that JSON parsing is correct
  </Accordion>

  <Accordion title="Video Processing Issues">
    * Confirm that video URLs are accessible
    * Check video download permissions and network connections
    * Verify video save paths and permissions
    * Handle video download timeouts and retry logic
    * Implement checksum validation for large video files
  </Accordion>

  <Accordion title="Task Failure Issues">
    * Check if video modification parameters are reasonable
    * Verify input video format and quality
    * Confirm prompt length and format
    * Consider adjusting modification parameters and retry
    * Review error messages in promptJson for debugging
  </Accordion>
</AccordionGroup>

## Alternative Solution

If you cannot use the callback mechanism, you can also use polling:

<Card title="Poll Query Results" icon="radar" href="/luma-api/get-luma-modify-details">
  Use the get Luma modify details endpoint to regularly query task status. We recommend querying every 30 seconds for video generation tasks.
</Card>
