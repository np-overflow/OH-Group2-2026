# Background Remover API

## Overview
This is the backend API for a digital photobooth application that removes backgrounds from images and allows users to customize photostrips with custom backgrounds and stickers.

## Features
- Session management for user isolation
- Background removal from images using rembg library
- Custom background storage and retrieval
- Secure session-based authentication
- RESTful API design

## Prerequisites
- Python 3.9+
- pip package manager

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv .venv
```

3. Activate the virtual environment:
   - **macOS / Linux:**
     ```bash
     source .venv/bin/activate
     ```
   - **Windows (PowerShell):**
     ```powershell
     .venv\Scripts\Activate.ps1
     ```

4. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Running the Application

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation
Comprehensive API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Testing

### Running Tests
Run all tests with pytest:
```bash
cd backend
pytest
```

### Test Coverage
The test suite includes:
- Unit tests for all API endpoints
- Integration tests for complete workflows
- Security tests for session authentication
- Edge case testing for error conditions

### Test Files
- `test_security.py`: Security and session-related tests
- `test_backend.py`: Comprehensive backend functionality tests

## Deployment
The application can be deployed using Docker with the provided Dockerfile and docker-compose.yml files.

## Architecture
- Built with FastAPI for high performance and automatic API documentation
- Uses rembg library for background removal
- Session-based authentication with in-memory storage
- Temporary file storage for user backgrounds

## Security
- Session passwords are cryptographically secure
- All session operations require authentication
- Session isolation prevents cross-user access
- Input validation for all file uploads
