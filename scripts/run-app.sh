#!/bin/sh
PORT=5173
echo "Building frontend image"
docker build -t kanban-board-frontend .
echo "Running frontend container"
CONTAINER_ID=$(docker run -d --rm -p $PORT:$PORT --name kanban-board-frontend kanban-board-frontend)

echo "App running at http://localhost:$PORT/"
echo "Reading container logs from container ${CONTAINER_ID}"
docker logs -f "$CONTAINER_ID"