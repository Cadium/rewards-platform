# Backend

Laravel powers the loyalty domain for this assessment.

## What It Does

- records purchases
- unlocks achievements when purchase thresholds are met
- upgrades badges when achievement thresholds are met
- logs a mocked cashback payout of `₦300` on every new badge unlock
- exposes the customer loyalty state through JSON endpoints

## Main Endpoints

```text
GET  /api/users
GET  /api/users/{user}/achievements
POST /api/users/{user}/purchases
```

## Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

## Run

```bash
php artisan serve
```

The API runs on `http://localhost:8000` by default.

## Tests

```bash
php artisan test
```
