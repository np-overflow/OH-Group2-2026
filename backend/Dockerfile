FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if needed (e.g. for rembg)
# rembg[cpu] might need some shared libraries, but slim usually works. 
# If issues arise, we can switch to python:3.11.

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port 8000 (though network_mode: service:caddy uses host network of caddy container)
EXPOSE 8000

CMD ["fastapi", "run", "main.py", "--port", "8000"]
