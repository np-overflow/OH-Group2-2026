# OH-Group2-2026 Monorepo Guide

This project houses a FastAPI backend (`backend/`) and a Next.js frontend (`frontend/`). Follow the steps below to boot both services locally and to call the backend APIs via the frontend.

## Prerequisites
- Python 3.9 or newer (see `backend/README.md` for detailed venv steps)
- Node.js 18+ with npm (installed automatically with `npx create-next-app`)

## 1. Install Dependencies
### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # .venv\Scripts\Activate.ps1 on Windows
pip install --upgrade pip
pip install -r requirements.txt
```
Leave this terminal open with the virtual environment activated.

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
```

## 2. Run Both Servers Concurrently
Keep two terminals (or use panes/tabs):

**Terminal A – FastAPI**
```bash
cd backend
source .venv/bin/activate
fastapi dev main.py
```
This exposes the API at `http://127.0.0.1:8000`.

**Terminal B – Next.js dev server**
```bash
cd frontend
npm run dev
```
Next.js will serve the app (default `http://localhost:3000`). The `next.config.ts` rewrite forwards any request matching `/api/*` to the FastAPI server.

## 3. Requesting APIs From The App
- **From the browser or frontend code:** call relative URLs like `/api/health` or `/api/remove-bg`. Next.js proxies these to `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/remove-bg`, so no extra configuration is needed in React components.
- **Direct testing (e.g., curl/Postman):** hit the FastAPI server directly at `http://127.0.0.1:8000/<endpoint>` while the backend is running.

If you add new FastAPI routes, they automatically become available to the frontend via the `/api/*` proxy. Restart the FastAPI server after making dependency or config changes.
