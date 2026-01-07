from fastapi.testclient import TestClient
from main import app, SESSIONS
import pytest
import io

client = TestClient(app)

def test_create_session():
    response = client.post("/create-session")
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "session_password" in data
    assert data["session_id"] in SESSIONS
    assert SESSIONS[data["session_id"]] == data["session_password"]

def test_upload_background_no_password():
    # Create session
    resp = client.post("/create-session")
    session_id = resp.json()["session_id"]
    
    # Attempt upload without header
    files = {"file": ("test.png", io.BytesIO(b"fake image data"), "image/png")}
    response = client.post(f"/upload-background/{session_id}", files=files)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid session password."

def test_upload_background_wrong_password():
    # Create session
    resp = client.post("/create-session")
    session_id = resp.json()["session_id"]
    
    # Attempt upload with wrong password
    files = {"file": ("test.png", io.BytesIO(b"fake image data"), "image/png")}
    response = client.post(
        f"/upload-background/{session_id}", 
        files=files,
        headers={"X-Session-Password": "wrong_password"}
    )
    assert response.status_code == 401

def test_upload_and_get_background_success():
    # Create session
    resp = client.post("/create-session")
    data = resp.json()
    session_id = data["session_id"]
    password = data["session_password"]
    
    # Upload with correct password
    files = {"file": ("test.png", io.BytesIO(b"fake image data"), "image/png")}
    response = client.post(
        f"/upload-background/{session_id}", 
        files=files,
        headers={"X-Session-Password": password}
    )
    assert response.status_code == 200
    
    # Get with correct password
    response = client.get(
        f"/get-background/{session_id}",
        headers={"X-Session-Password": password}
    )
    assert response.status_code == 200
    assert response.content == b"fake image data"

def test_delete_background_success():
    # Create session
    resp = client.post("/create-session")
    data = resp.json()
    session_id = data["session_id"]
    password = data["session_password"]
    
    # Upload first
    files = {"file": ("test.png", io.BytesIO(b"fake image data"), "image/png")}
    client.post(
        f"/upload-background/{session_id}", 
        files=files,
        headers={"X-Session-Password": password}
    )
    
    # Delete with correct password
    response = client.delete(
        f"/delete-background/{session_id}",
        headers={"X-Session-Password": password}
    )
    assert response.status_code == 200
    
    # Verify it's gone
    response = client.get(
        f"/get-background/{session_id}",
        headers={"X-Session-Password": password}
    )
    assert response.status_code == 404
