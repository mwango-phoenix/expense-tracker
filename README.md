# Expense Tracker

Expense Tracker is a mobile app for tracking income, expenses, and spending trends. It gives you a quick dashboard view of where money is going, plus simple screens for adding or updating transactions.

## What You Can Do

- Create an account and sign in
- Add income and expense entries
- Edit or delete past transactions
- Pick a category and date for each entry
- View totals and spending breakdowns on the dashboard
- Switch chart styles to compare your spending in different ways

## Using the App

### 1. Sign in

Open the app and sign up or log in with your email and password.

### 2. Check the dashboard

The home screen shows your overall balance, income, expenses, and recent activity.

### 3. Add income or expenses

Use the Income or Expense tab to add a new item. Choose a category, amount, date, and optional description.

### 4. Review your spending

Open the analytics or chart view to see your spending breakdown. You can compare periods like day, week, month, and year, and switch between donut and bar chart views.

### 5. Update anything later

Tap an existing transaction to edit it, or remove it if you no longer need it.

## Getting the App Running Locally

If you want to run the project on your own machine, you will need:

- Node.js 18 or newer
- npm
- A MongoDB database
- Expo Go, an emulator, or a simulator

### Backend setup

Create a `backend/.env` file with:

```bash
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend from the `backend/` folder:

```bash
npm install
npm run dev
```

### Frontend setup

If needed, set the API address in `frontend/.env`:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

Use your computer's LAN IP instead of `10.0.2.2` when running on a physical device.

Then start the app from the `frontend/` folder:

```bash
npm install
npm start
```

Press `a` for Android, `i` for iOS, or scan the QR code in Expo Go.
