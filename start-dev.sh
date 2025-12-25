#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "Starting development environment from $ROOT_DIR"

# Install deps if missing
if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  npm --prefix "$ROOT_DIR/backend" install
fi
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm --prefix "$ROOT_DIR/frontend" install
fi

cleanup() {
  echo "\nShutting down..."
  [ -n "${backend_pid-}" ] && kill "${backend_pid}" 2>/dev/null || true
  [ -n "${frontend_pid-}" ] && kill "${frontend_pid}" 2>/dev/null || true
  wait 2>/dev/null || true
  exit
}
trap cleanup INT TERM EXIT

# Start backend and frontend with prefixed logs.
# This uses subshells and sed to prefix each line. Press Ctrl+C to stop both.
(
  cd "$ROOT_DIR/backend"
  npm run dev 2>&1 | sed 's/^/[backend] /'
) &
backend_pid=$!

(
  cd "$ROOT_DIR/frontend"
  npm run dev 2>&1 | sed 's/^/[frontend] /'
) &
frontend_pid=$!

echo "Backend PID: $backend_pid  Frontend PID: $frontend_pid"

# Wait for both processes; script will exit on Ctrl+C (triggering trap)
wait
