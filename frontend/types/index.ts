// Central type definitions for the expense tracker app

export interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  icon: string;
  date: string;
  type: "income" | "expense";
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: {
    income: number;
    expenses: number;
  };
}

export interface Income {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  icon: string;
  date: string;
}

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  icon: string;
  date: string;
}

export interface Category {
  name: string;
  icon: string;
}

// Category constants
export const INCOME_CATEGORIES: Category[] = [
  { name: "Salary", icon: "money-check-alt" },
  { name: "Investment", icon: "chart-line" },
  { name: "Freelance", icon: "laptop-code" },
  { name: "Gift", icon: "gift" },
  { name: "Other", icon: "money-bill-wave" },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { name: "Food", icon: "utensils" },
  { name: "Drinks", icon: "coffee" },
  { name: "Transport", icon: "bus" },
  { name: "Clothing", icon: "tshirt" },
  { name: "Entertainment", icon: "film" },
  { name: "Grocery", icon: "shopping-cart" },
  { name: "Gifting", icon: "gift" },
  { name: "Other", icon: "wallet" },
];
