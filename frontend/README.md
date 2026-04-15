# Frontend

This dashboard consumes the Laravel API and presents a customer-facing loyalty view with:

- current badge and next badge
- unlocked achievements with unlock dates
- progress toward the next badge
- sample customer switching
- simulated purchases that refresh the loyalty state in real time

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the backend URL, for example:

```bash
VITE_API_URL=http://localhost:8000
```

## Run

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Quality Checks

```bash
npm run lint
npm run build
```
