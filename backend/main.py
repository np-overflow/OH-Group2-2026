from fastapi import FastAPI, File, HTTPException, UploadFile, Header, Depends
from fastapi.responses import Response, FileResponse
from rembg import remove
import os
import shutil
import secrets
from pathlib import Path
from typing import Dict

app = FastAPI(title="Background Remover API")

# Temporary storage directory for backgrounds
TEMP_DIR = Path("temp_backgrounds")
TEMP_DIR.mkdir(exist_ok=True)

# In-memory session storage (session_id -> session_password)
SESSIONS: Dict[str, str] = {}


async def verify_session(session_id: str, x_session_password: str = Header(None)):
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found.")
    if SESSIONS[session_id] != x_session_password:
        raise HTTPException(status_code=401, detail="Invalid session password.")
    return session_id


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Basic readiness probe for monitoring."""
    return {"status": "ok"}


@app.post("/create-session")
async def create_session() -> dict[str, str]:
    """Create a new session and return the ID and password."""
    session_id = secrets.token_urlsafe(16)
    session_password = secrets.token_urlsafe(32)
    SESSIONS[session_id] = session_password
    return {"session_id": session_id, "session_password": session_password}


@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)) -> Response:
	"""Strip the background from a single uploaded image."""
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="File must be an image.")

	data = await file.read()
	if not data:
		raise HTTPException(status_code=400, detail="Uploaded file is empty.")

	try:
		result_bytes = remove(data)
	except Exception as exc:  # pragma: no cover - rembg passthrough errors
		raise HTTPException(status_code=500, detail="Failed to process image.") from exc

	return Response(content=result_bytes, media_type="image/png")


@app.post("/upload-background/{session_id}")
async def upload_background(
    session_id: str = Depends(verify_session), 
    file: UploadFile = File(...)
) -> dict[str, str]:
	"""Store background image temporarily for a session."""
	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="File must be an image.")

	data = await file.read()
	if not data:
		raise HTTPException(status_code=400, detail="Uploaded file is empty.")

	try:
		# Create session-specific directory
		session_dir = TEMP_DIR / session_id
		session_dir.mkdir(exist_ok=True)
		
		# Save the background image
		file_path = session_dir / "background.png"
		with open(file_path, "wb") as f:
			f.write(data)
		
		return {"status": "success", "message": "Background uploaded successfully"}
	except Exception as exc:
		raise HTTPException(status_code=500, detail="Failed to upload background.") from exc


@app.get("/get-background/{session_id}")
async def get_background(session_id: str = Depends(verify_session)) -> FileResponse:
	"""Retrieve the stored background image for a session."""
	file_path = TEMP_DIR / session_id / "background.png"
	
	if not file_path.exists():
		raise HTTPException(status_code=404, detail="Background not found for this session.")
	
	try:
		return FileResponse(file_path, media_type="image/png")
	except Exception as exc:
		raise HTTPException(status_code=500, detail="Failed to retrieve background.") from exc


@app.delete("/delete-background/{session_id}")
async def delete_background(session_id: str = Depends(verify_session)) -> dict[str, str]:
	"""Delete the stored background image for a session."""
	session_dir = TEMP_DIR / session_id
	
	if not session_dir.exists():
		raise HTTPException(status_code=404, detail="Session directory not found.")
	
	try:
		shutil.rmtree(session_dir)
		return {"status": "success", "message": "Background deleted successfully"}
	except Exception as exc:
		raise HTTPException(status_code=500, detail="Failed to delete background.") from exc
