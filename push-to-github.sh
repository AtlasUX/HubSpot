#!/bin/bash
# Run this script to set up git and push to GitHub
# Usage: bash push-to-github.sh

set -e
cd "$(dirname "$0")"

echo "Initializing git..."
git init

echo "Adding remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/singram_hubspot/HubSpot.git

echo "Staging files..."
git add .

echo "Committing..."
git commit -m "Initial commit: HSP-Onboarding and DesignSystem"

echo "Pushing to main..."
git branch -M main
git push -u origin main

echo "Done! Check https://github.com/singram_hubspot/HubSpot"
