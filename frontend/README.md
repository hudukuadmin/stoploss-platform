# Stop-Loss Platform Frontend

React + TypeScript dashboard for the stop-loss insurance platform. Built with Vite, React Router, Recharts, and Lucide icons.

## Prerequisites

- Node.js 18+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

   Opens at **http://localhost:5173**.

3. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Environment Variables

| Variable       | Default                      | Description       |
| -------------- | ---------------------------- | ----------------- |
| `VITE_API_URL` | `http://localhost:4000/api`  | Backend API URL   |

## Pages

| Route            | Description                                      |
| ---------------- | ------------------------------------------------ |
| `/`              | Dashboard with key metrics and charts            |
| `/groups`        | Manage groups (ACOs, health plans, TPAs, etc.)   |
| `/quotes`        | Generate and review stop-loss quotes             |
| `/underwriting`  | Underwriting review queue with approve/decline   |
| `/policies`      | View bound policies and coverage details         |
| `/analytics`     | Analytics with premium trends and risk breakdown |

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start dev server with HMR    |
| `npm run build`   | Type check + production build|
| `npm run preview` | Preview production build     |
| `npm run lint`    | Run ESLint                   |

## Notes

- The app works standalone with mock/fallback data when the backend is unavailable.
- All API requests include an `x-tenant-id: default-tenant` header for multi-tenant support.
