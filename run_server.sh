#!/bin/bash

BASE_DIR="$HOME/Documents/Work/iPhonePriceComparison"

DATA_JSON_PATH="$BASE_DIR/UI/data.json"

if [ -f "$DATA_JSON_PATH" ]; then
    # If data.json exists, delete it
    rm "$DATA_JSON_PATH"
fi
cp "$BASE_DIR/data.json" "$BASE_DIR/UI/"
cd "$BASE_DIR/UI"


http-server &
sleep 2 
start http://localhost:8080/

