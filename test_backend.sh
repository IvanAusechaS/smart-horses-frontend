#!/bin/bash

# Test Backend Endpoints
# Usar: bash test_backend.sh

BACKEND_URL="http://localhost:5000"

echo "Testing Smart Horses Backend..."
echo "================================"

# Test 1: Health Check
echo -e "\n1. Health Check"
curl -s "${BACKEND_URL}/health" | python3 -m json.tool

# Test 2: CORS Preflight
echo -e "\n2. CORS Preflight Test"
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i "${BACKEND_URL}/api/game/new"

# Test 3: Create New Game
echo -e "\n3. Create New Game (Beginner)"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"difficulty":"beginner"}' \
  "${BACKEND_URL}/api/game/new" | python3 -m json.tool

echo -e "\nTests completed!"
