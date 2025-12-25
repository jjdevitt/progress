# Progress Frontend

A small React + Vite frontend that fetches `/api/tasks` from the backend and displays them in a table.

Quick start

```bash
cd frontend
npm install
npm run dev
```

Notes

- The Vite dev server proxies `/api` to `http://localhost:3000` (see `vite.config.js`). Start the backend first on port `3000` or change the proxy target.
- Open the app at `http://localhost:5173`.
