from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import Response
from rembg import remove

app = FastAPI(title="Background Remover API")


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
