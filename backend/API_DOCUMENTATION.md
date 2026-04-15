# Background Remover API Documentation

## Overview
This is the API documentation for the Background Remover service used in the digital photobooth application. The API provides functionality for:
- Session management
- Background removal from images
- Custom background storage and retrieval
- Photostrip customization

## Base URL
All endpoints are relative to the base URL of the running service.

## Authentication
All endpoints requiring session authentication use the `X-Session-Password` header:
```
X-Session-Password: <session_password>
```

## Endpoints

### 1. Health Check
**GET** `/health`

**Description**: Basic readiness probe for monitoring the service.

**Responses**:
- `200 OK`: Service is healthy
  ```json
  {
    "status": "ok"
  }
  ```

### 2. Create Session
**POST** `/create-session`

**Description**: Creates a new session and returns session credentials.

**Responses**:
- `200 OK`: Session created successfully
  ```json
  {
    "session_id": "string",
    "session_password": "string"
  }
  ```

### 3. Remove Background
**POST** `/remove-bg`

**Description**: Strips the background from an uploaded image.

**Request**:
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Responses**:
- `200 OK`: Background removed successfully (returns processed image)
- `400 Bad Request`: Invalid file type or empty file
  ```json
  {
    "detail": "File must be an image."
  }
  ```
- `400 Bad Request`: Empty file
  ```json
  {
    "detail": "Uploaded file is empty."
  }
  ```
- `500 Internal Server Error`: Failed to process image
  ```json
  {
    "detail": "Failed to process image."
  }
  ```

### 4. Upload Background
**POST** `/upload-background/{session_id}`

**Description**: Stores a background image temporarily for a session.

**Path Parameters**:
- `session_id` (string): Session identifier

**Headers**:
- `X-Session-Password` (string): Session password for authentication

**Request**:
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Responses**:
- `200 OK`: Background uploaded successfully
  ```json
  {
    "status": "success",
    "message": "Background uploaded successfully"
  }
  ```
- `400 Bad Request`: Invalid file type or empty file
  ```json
  {
    "detail": "File must be an image."
  }
  ```
- `400 Bad Request`: Empty file
  ```json
  {
    "detail": "Uploaded file is empty."
  }
  ```
- `401 Unauthorized`: Invalid session password
  ```json
  {
    "detail": "Invalid session password."
  }
  ```
- `404 Not Found`: Session not found
  ```json
  {
    "detail": "Session not found."
  }
  ```
- `500 Internal Server Error`: Failed to upload background
  ```json
  {
    "detail": "Failed to upload background."
  }
  ```

### 5. Get Background
**GET** `/get-background/{session_id}`

**Description**: Retrieves the stored background image for a session.

**Path Parameters**:
- `session_id` (string): Session identifier

**Headers**:
- `X-Session-Password` (string): Session password for authentication

**Responses**:
- `200 OK`: Background image retrieved successfully (returns image file)
- `401 Unauthorized`: Invalid session password
  ```json
  {
    "detail": "Invalid session password."
  }
  ```
- `404 Not Found`: Session or background not found
  ```json
  {
    "detail": "Background not found for this session."
  }
  ```
- `500 Internal Server Error`: Failed to retrieve background
  ```json
  {
    "detail": "Failed to retrieve background."
  }
  ```

### 6. Delete Background
**DELETE** `/delete-background/{session_id}`

**Description**: Deletes the stored background image for a session.

**Path Parameters**:
- `session_id` (string): Session identifier

**Headers**:
- `X-Session-Password` (string): Session password for authentication

**Responses**:
- `200 OK`: Background deleted successfully
  ```json
  {
    "status": "success",
    "message": "Background deleted successfully"
  }
  ```
- `401 Unauthorized`: Invalid session password
  ```json
  {
    "detail": "Invalid session password."
  }
  ```
- `404 Not Found`: Session directory not found
  ```json
  {
    "detail": "Session directory not found."
  }
  ```
- `500 Internal Server Error`: Failed to delete background
  ```json
  {
    "detail": "Failed to delete background."
  }
  ```

## Error Responses
All error responses follow this format:
```json
{
  "detail": "Error message describing the issue"
}
```

## Session Management
Sessions are identified by a unique session ID and password. Sessions are stored in memory and are automatically cleaned up when the background is deleted.

## Data Storage
- Background images are stored temporarily in the `temp_backgrounds/{session_id}/background.png` directory structure
- Sessions are stored in memory as `SESSIONS[session_id] = session_password`

## Security Considerations
- Session passwords are randomly generated using cryptographically secure methods
- All session operations require authentication via the `X-Session-Password` header
- Session IDs are URL-safe base64 encoded strings
- Background images are stored in session-specific directories to prevent cross-session access

## Testing
Comprehensive tests are available in `test_backend.py` and `test_security.py`. Run tests with:
```bash
cd backend
pytest
```

## Deployment
The API can be deployed using Docker with the provided Dockerfile and docker-compose.yml files.
