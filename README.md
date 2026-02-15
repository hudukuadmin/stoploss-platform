# Stop-Loss Insurance Platform

Full-stack application for managing stop-loss insurance — quoting, underwriting, policy binding, and analytics.

## Architecture

```
stop-loss/
├── backend/    # NestJS REST API (TypeORM + PostgreSQL)
└── frontend/   # React + Vite dashboard
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)

## Quick Start

### 1. Start PostgreSQL

```bash
docker run -d --name stoploss-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=stoploss_platform \
  -p 5432:5432 \
  postgres:16
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

API runs at **http://localhost:4000**.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

UI runs at **http://localhost:5173**.

## Configuration

### Backend (`backend/.env`)

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=stoploss_platform
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend

Set `VITE_API_URL` to override the default backend URL (`http://localhost:4000/api`).

## Key Features

- **Groups** — Manage ACOs, health plans, TPAs, and employer groups
- **Members** — Individual and bulk member enrollment with risk data
- **Quotes** — Automated quote generation with actuarial risk scoring
- **Underwriting** — Auto-approve low-risk, manual review for high-risk
- **Policies** — Bind approved quotes into active policies
- **Analytics** — Dashboard with premium trends, risk distribution, and loss ratios
- **Multi-tenant** — All data scoped by `x-tenant-id` header
