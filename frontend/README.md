# Expense Tracker — Frontend

## Prerequisites

- **Node.js** 18+ and npm
- **Expo Go** on a physical device, or an Android/iOS emulator
- **Backend running** — the app will not work without it (see [Backend setup](#backend-setup))

## Quick start

From this directory:

```bash
npm install
npm start
```

Then press `a` (Android emulator), `i` (iOS simulator), or scan the QR code with Expo Go.

| Script | Command | Purpose |
|--------|---------|---------|
| Dev server | `npm start` | Start Expo dev server |
| Android | `npm run android` | Open on Android emulator |
| iOS | `npm run ios` | Open on iOS simulator |
| Web | `npm run web` | Run in browser (limited RN support) |
| Lint | `npm run lint` | Run ESLint |

## Backend setup

1. In `../backend`, create a `.env` with at least:

   ```
   PORT=3001
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<a-secret-string>
   ```

2. Install and start the backend:

   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

## What the app does

- **Sign up / log in** — JWT stored in AsyncStorage via Zustand
- **Home (Dashboard)** — monthly net balance, income/expense totals, paginated recent transactions
- **Income / Expense tabs** — list, create, edit, and delete entries via modal forms
- **Categories** — predefined icons and labels in

Authenticated API calls send `Authorization: Bearer <token>`.

## Project structure

```
frontend/
├── app/                    # Routes (Expo Router, file-based)
│   ├── _layout.tsx         # Root layout: auth guard + navigation
│   ├── (auth)/             # Unauthenticated screens
│   │   ├── index.tsx       # Login
│   │   └── signup.tsx      # Registration
│   └── (tabs)/             # Main app (tab navigator)
│       ├── _layout.tsx     # Tab bar (Home, Income, Expense)
│       ├── index.tsx       # Dashboard
│       ├── income.tsx      # Income CRUD
│       └── expense.tsx     # Expense CRUD
├── components/             # Shared UI
│   ├── DatePicker.tsx
│   ├── LogoutButton.tsx
│   ├── SafeScreen.tsx
│   ├── Skeleton.tsx
│   ├── SpendingChart.tsx   # Pie chart (gifted-charts)
│   ├── TransactionCard.tsx
│   └── TransactionModal.tsx
├── constants/
│   └── colours.js          # Theme palette (dark UI)
├── store/
│   └── authStore.tsx       # Zustand: login, register, logout, session
├── styles/                 # StyleSheet objects per screen/feature
├── types/
│   └── index.ts            # Transaction types + category constants
├── app.json                # Expo config
└── tsconfig.json           # TypeScript; `@/*` path alias → project root
```

## Architecture
### Styling conventions

- **Colours** — import the default export from `constants/colours.js` (file is spelled `colours`, not `colors`).
- **Layout styles** — co-located in `styles/*.styles.js` and imported per screen.
- **Safe areas** — `useSafeAreaInsets()` from `react-native-safe-area-context` on tab screens; `SafeScreen` wrapper available for full-screen layouts.

### Types and categories

[`types/index.ts`](types/index.ts) defines `Transaction`, `Income`, `Expense`, `DashboardSummary`, and exports `INCOME_CATEGORIES` / `EXPENSE_CATEGORIES` used by `TransactionModal`.

### Path alias

Import with `@/` instead of relative paths:


## API endpoints used

All routes are prefixed with `/api` on the backend.

| Area | Methods | Path |
|------|---------|------|
| Auth | POST | `/auth/register`, `/auth/login` |
| Income | GET, POST | `/income` |
| Income | PUT, DELETE | `/income/:id` |
| Expense | GET, POST | `/expense` |
| Expense | PUT, DELETE | `/expense/:id` |
| Dashboard | GET | `/dashboard/summary?period=month` |


## Common tasks

### Add a new tab screen

1. Add `app/(tabs)/your-screen.tsx`.
2. Register it in `app/(tabs)/_layout.tsx` with a `Tabs.Screen` entry.

### Add a transaction category

Edit `INCOME_CATEGORIES` or `EXPENSE_CATEGORIES` in `types/index.ts`. Icons use [Font Awesome 5](https://icons.expo.fyi/) names passed to `FontAwesome5`.

### Refresh the dashboard from another tab

After creating/updating/deleting income or expense, call `triggerDashboardRefresh()` from `useAuthStore`. The home screen watches `refreshDashboard` and reloads.

### Run on a physical device

1. Phone and computer must be on the same Wi‑Fi.
2. Set `EXPO_PUBLIC_API_URL` to your machine's LAN IP (not `localhost` or `10.0.2.2`).
3. Ensure the backend listens on `0.0.0.0` or that your firewall allows port 3001.

