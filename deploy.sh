#!/bin/bash
set -e
echo "📦 Copying index.html → public/index.html"
cp index.html public/index.html
echo "🚀 Deploying to Firebase..."
firebase deploy
echo "✅ Done! https://rehab-store-1a87c.web.app"
