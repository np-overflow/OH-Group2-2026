from __future__ import annotations

import secrets
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, Response
from rembg import remove

app = FastAPI(title="Background Remover API")

IMAGES_ROOT = Path(__file__).resolve().parent / "images"
SESSIONS: dict[str, dict[str, Any]] = {}


@app.get("/health")
async def health_check() -> dict[str, str]:
	"""Basic readiness probe for monitoring."""
	return {"status": "ok"}


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


def _ensure_images_root() -> None:
	IMAGES_ROOT.mkdir(parents=True, exist_ok=True)


def _validate_session(session_id: str, password: str) -> dict[str, Any]:
	if not password:
		raise HTTPException(status_code=400, detail="Password is required.")

	session = SESSIONS.get(session_id)
	if not session:
		raise HTTPException(status_code=404, detail="Session not found.")

	if session["password"] != password:
		raise HTTPException(status_code=403, detail="Invalid password.")

	return session


@app.post("/sessions")
async def create_session(photos: list[UploadFile] = File(...)) -> dict[str, Any]:
	"""Accept three photos, remove backgrounds, and persist them under a session."""
	if len(photos) != 3:
		raise HTTPException(status_code=400, detail="Exactly three photos are required.")

	for photo in photos:
		if not photo.content_type or not photo.content_type.startswith("image/"):
			raise HTTPException(status_code=400, detail="All uploads must be images.")

	_ensure_images_root()
	session_id = uuid4().hex
	password = secrets.token_urlsafe(8)
	session_dir = IMAGES_ROOT / session_id
	session_dir.mkdir(parents=True, exist_ok=True)

	stored_files: list[str] = []
	for idx, photo in enumerate(photos, start=1):
		data = await photo.read()
		if not data:
			raise HTTPException(status_code=400, detail="One of the uploads was empty.")

		try:
			processed_bytes = remove(data)
		except Exception as exc:  # pragma: no cover - rembg passthrough errors
			raise HTTPException(status_code=500, detail="Failed to process one of the photos.") from exc

		filename = f"photo_{idx}.png"
		(session_dir / filename).write_bytes(processed_bytes)
		stored_files.append(filename)

	SESSIONS[session_id] = {
		"password": password,
		"files": stored_files,
		"created_at": datetime.utcnow().isoformat(),
	}

	base_image_paths = [f"/sessions/{session_id}/image/{name}" for name in stored_files]
	return {
		"session_id": session_id,
		"password": password,
		"images": base_image_paths,
	}


@app.get("/sessions/{session_id}/images")
async def list_session_images(session_id: str, password: str = Query(...)) -> dict[str, list[str]]:
	"""Return signed image URLs for a given session after password verification."""
	session = _validate_session(session_id, password)
	urls = [
		f"/sessions/{session_id}/image/{filename}?password={password}"
		for filename in session["files"]
	]
	return {"images": urls}


@app.get("/sessions/{session_id}/image/{filename}")
async def serve_image(session_id: str, filename: str, password: str = Query(...)) -> FileResponse:
	"""Serve a processed image if the password matches the session."""
	session = _validate_session(session_id, password)
	if filename not in session["files"]:
		raise HTTPException(status_code=404, detail="Image not found.")

	file_path = IMAGES_ROOT / session_id / filename
	if not file_path.is_file():
		raise HTTPException(status_code=404, detail="Image not found.")

	return FileResponse(file_path, media_type="image/png")
