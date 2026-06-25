#!/bin/bash
set -e
echo "📦 Copying files → public/"
cp index.html public/index.html
cp styles.css public/styles.css
cp app.js public/app.js
echo "🚀 Deploying to Firebase..."
firebase deploy
echo "✅ Done! https://rehab-store-1a87c.web.app"
