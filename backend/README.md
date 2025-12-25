# Progress Backend

Simple Express backend exposing a `/api/tasks` endpoint that returns a static JSON array of tasks.

Quick start:

```bash
cd backend
npm install
npm start
```

API:
- `GET /api/tasks` — returns the list of tasks (JSON array)
- `GET /` — basic health/info endpoint

Environment:
- Port: `PORT` (default `3000`)
