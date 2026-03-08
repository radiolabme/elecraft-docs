#!/bin/sh
# Find a free port starting from the given port number

START_PORT=${1:-4321}
PORT=$START_PORT

while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    PORT=$((PORT + 1))
done

echo $PORT
