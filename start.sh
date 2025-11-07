#!/bin/bash

# Démarrer le backend en arrière-plan
echo "🚀 Démarrage backend PONIA AI (port 3000)..."
node server/index.js &
BACKEND_PID=$!

# Attendre que le backend soit prêt
sleep 2

# Démarrer le frontend
echo "🎨 Démarrage frontend Vite (port 5000)..."
npm run dev

# Si le frontend s'arrête, tuer le backend
kill $BACKEND_PID 2>/dev/null
