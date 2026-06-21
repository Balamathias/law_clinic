#!/bin/bash

# Ensure we run from the script's directory
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    echo "Activating virtual environment (.venv)..."
    source .venv/bin/activate
fi

# Run ASGI server with uvicorn
echo "Starting Law Clinic ASGI Server on http://127.0.0.1:8000..."
uvicorn clinic.asgi:application --reload --port 8000
