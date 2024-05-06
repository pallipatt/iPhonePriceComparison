#!/bin/bash
# cd applevsecoprice
# npm init -y 
# npm run i 
# npm run cy:run 
# cd ..

# BASE_DIR="$HOME/Documents/Work/iPhonePriceComparison"

# DATA_JSON_PATH="$BASE_DIR/UI/data.json"

# if [ -f "$DATA_JSON_PATH" ]; then
#     # If data.json exists, delete it
#     rm "$DATA_JSON_PATH"
# fi
# cp "$BASE_DIR/data.json" "$BASE_DIR/UI/"
# cd "$BASE_DIR/UI"

# pwd 
# cd ..
cd UI
echo "Getting iPhone values for all grades in iPhone in QA env"
node eco_iphoneprices.js qa
echo "Getting iPhone values for all grades in iPhone in PROD env"
node eco_iphoneprices.js prod 
# cd ../..
cd ..
http-server &
sleep 2 
start http://localhost:8080/iphoneTable.html


