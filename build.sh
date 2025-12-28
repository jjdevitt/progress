#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "Installing dependencies..."
npm --prefix "$ROOT_DIR/frontend" install
npm --prefix "$ROOT_DIR/backend" install

echo "Building frontend..."
npm --prefix "$ROOT_DIR/frontend" run build

echo "Copying frontend build to backend/public..."
rm -rf "$ROOT_DIR/backend/public"
mkdir -p "$ROOT_DIR/backend/public"
cp -R "$ROOT_DIR/frontend/dist/"* "$ROOT_DIR/backend/public/"

echo "Building backend..."
npm --prefix "$ROOT_DIR/backend" run build

echo "Build complete. Backend production files at $ROOT_DIR/backend/dist and frontend static files at $ROOT_DIR/backend/public"