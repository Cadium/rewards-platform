# Rewards Platform

A full-stack loyalty rewards system where customers earn achievements and badges through purchases.

## Project Structure

```
rewards-platform/
├── backend/    # Laravel 13 API
└── frontend/   # React + Vite customer dashboard
```

---

## How It Works

1. A purchase is recorded → `PurchaseMade` event fires
2. `ProcessNewAchievements` listener checks purchase count against thresholds → fires `AchievementUnlocked` for each new milestone
3. `ProcessNewBadge` listener checks total achievements → fires `BadgeUnlocked` when a badge threshold is crossed
4. `ProcessCashback` listener logs a simulated ₦300 cashback payment

### Achievement thresholds

| Achievement    | Purchases required |
|---|---|
| First Purchase | 1   |
| 5 Purchases    | 5   |
| 10 Purchases   | 10  |
| 25 Purchases   | 25  |
| 50 Purchases   | 50  |
| 100 Purchases  | 100 |
| 200 Purchases  | 200 |
| 500 Purchases  | 500 |

### Badge thresholds

| Badge    | Achievements required |
|---|---|
| Beginner | 0 (default)           |
| Bronze   | 4                     |
| Silver   | 6                     |
| Gold     | 8                     |

---

## Backend Setup (Laravel)

### Requirements
- PHP 8.3+
- Composer

### Steps

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed achievements, badges, and sample users
php artisan db:seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`.

### API Endpoint

```
GET /api/users/{user}/achievements
```

**Response example:**

```json
{
  "purchase_count": 5,
  "unlocked_achievements": [
    { "name": "First Purchase", "unlocked_at": "2026-04-15T00:10:00.000000Z" },
    { "name": "5 Purchases", "unlocked_at": "2026-04-15T00:14:00.000000Z" }
  ],
  "next_available_achievements": ["10 Purchases"],
  "current_badge": "Beginner",
  "next_badge": "Bronze",
  "remaining_to_unlock_next_badge": 2
}
```

> `unlocked_achievements` returns objects rather than plain strings so the dashboard can display when each achievement was earned. The `name` field satisfies the original spec; `unlocked_at` is an additive extension.

### Running Tests

```bash
php artisan test
```

---

## Frontend Setup (React)

### Requirements
- Node.js 18+

### Steps

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file and set the API URL
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### Building for production

```bash
npm run build
```

---

## Running Both Together

Open two terminal tabs:

**Tab 1 — backend:**
```bash
cd backend && php artisan serve
```

**Tab 2 — frontend:**
```bash
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

The seeder creates five sample users with different purchase histories so the dashboard is useful immediately after setup.
