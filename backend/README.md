# Backend Environment Setup

Follow these steps to create an isolated Python environment for the backend and install the required dependencies.

## 1. Ensure Python Is Installed
Make sure Python 3.9+ is available on your system:

```bash
python3 --version
```

## 2. Create a Virtual Environment
From the `backend` directory, create a new virtual environment named `.venv`:

```bash
cd backend
python3 -m venv .venv
```

## 3. Activate the Virtual Environment
- **macOS / Linux:**
  ```bash
  source .venv/bin/activate
  ```
- **Windows (PowerShell):**
  ```powershell
  .venv\Scripts\Activate.ps1
  ```

You should see `(.venv)` prefixed to your shell prompt once activation succeeds.

## 4. Install Dependencies
With the virtual environment activated, install the required packages (FastAPI and the image background remover library) via `requirements.txt`:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 5. Deactivate When Finished
When you are done working, deactivate the virtual environment:

```bash
deactivate
```
