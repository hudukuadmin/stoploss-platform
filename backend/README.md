# Stop-Loss Platform Backend

NestJS REST API for a stop-loss insurance platform with multi-tenant support.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and update values as needed:

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

3. **Start PostgreSQL**

   Using Docker:

   ```bash
   docker run -d --name stoploss-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=stoploss_platform \
     -p 5432:5432 \
     postgres:16
   ```

4. **Run the server**

   ```bash
   # Development (watch mode)
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

   The API will be available at **http://localhost:4000**.

## API Endpoints

All endpoints require the `x-tenant-id` header.

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| POST   | `/api/groups`                     | Create a group               |
| GET    | `/api/groups`                     | List all groups              |
| GET    | `/api/groups/:id`                 | Get group details            |
| PUT    | `/api/groups/:id`                 | Update a group               |
| DELETE | `/api/groups/:id`                 | Delete a group               |
| POST   | `/api/members`                    | Create a member              |
| POST   | `/api/members/bulk`               | Bulk upload members          |
| GET    | `/api/members?groupId=:id`        | List members by group        |
| GET    | `/api/members/:id`                | Get member details           |
| PUT    | `/api/members/:id`                | Update a member              |
| POST   | `/api/quotes`                     | Generate a quote             |
| GET    | `/api/quotes`                     | List all quotes              |
| GET    | `/api/quotes/:id`                 | Get quote details            |
| PUT    | `/api/quotes/:id/status`          | Update quote status          |
| POST   | `/api/policies/bind`              | Bind a quote into a policy   |
| GET    | `/api/policies`                   | List all policies            |
| GET    | `/api/policies/:id`               | Get policy details           |
| PUT    | `/api/policies/:id/status`        | Update policy status         |
| POST   | `/api/underwriting/submit/:quoteId` | Submit quote for review    |
| PUT    | `/api/underwriting/review`        | Manual underwriting review   |
| GET    | `/api/underwriting/quote/:quoteId`| Get review by quote          |
| GET    | `/api/underwriting`               | List all reviews             |
| GET    | `/api/analytics/dashboard`        | Dashboard metrics            |

## Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run start:dev`| Start in watch mode        |
| `npm run build`    | Compile TypeScript         |
| `npm run start:prod`| Start compiled output     |
| `npm run lint`     | Type check with `tsc`      |
