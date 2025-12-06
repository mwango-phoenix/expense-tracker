import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "@/styles/home.styles";
import colours from "@/constants/colours";
import { SkeletonCard, SkeletonSummaryCard } from "@/components/Skeleton";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  icon: string;
  date: string;
  type: "income" | "expense";
}

interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: {
    income: number;
    expenses: number;
  };
}

export default function Index() {
  const { token, isCheckingAuth, refreshDashboard } = useAuthStore() as { 
    token: string | null; 
    isCheckingAuth: boolean;
    refreshDashboard: number;
  };
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    net: 0,
    transactionCount: { income: 0, expenses: 0 },
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = process.env.API_URL || "http://10.0.2.2:3001";
  console.log("API_URL:", API_URL);

  const fetchDashboardSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/summary?period=month`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };

  const fetchTransactions = async (pageNum: number, isRefresh = false) => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`${API_URL}/api/income?page=${pageNum}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/expense?page=${pageNum}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();

      const incomeTransactions = incomeData.incomes?.map((item: any) => ({
        ...item,
        type: "income",
      })) || [];

      const expenseTransactions = expenseData.expenses?.map((item: any) => ({
        ...item,
        type: "expense",
      })) || [];

      const combined = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (isRefresh) {
        setTransactions(combined);
      } else {
        setTransactions((prev) => [...prev, ...combined]);
      }

      setHasMore(
        incomeData.currentPage < incomeData.totalPages ||
        expenseData.currentPage < expenseData.totalPages
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      setPage(1);
    } else {
      setLoading(true);
    }

    await fetchDashboardSummary();
    await fetchTransactions(isRefresh ? 1 : page, isRefresh);

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isCheckingAuth && token) {
      loadData();
    } else if (!isCheckingAuth && !token) {
      setLoading(false);
    }
  }, [isCheckingAuth, token]);

  useEffect(() => {
    if (!isCheckingAuth && token && refreshDashboard > 0) {
      loadData(true);
    }
  }, [refreshDashboard]);

  const onRefresh = useCallback(() => {
    loadData(true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchTransactions(page + 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colours.primary}
        />
      }
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isCloseToBottom =
          layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isCloseToBottom) {
          loadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      <Text style={styles.header}>Dashboard</Text>

      {/* Summary Card */}
      {loading ? (
        <SkeletonSummaryCard />
      ) : (
      <View style={styles.balanceCard}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: colours.textSecondary, fontSize: 14, marginBottom: 4 }}>
            Net Balance
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: summary.net >= 0 ? colours.success : colours.error,
            }}
          >
            {formatCurrency(summary.net)}
          </Text>
        </View>

        <View style={styles.incomeExpenseRow}>
          <View>
            <Text style={{ color: colours.textSecondary, fontSize: 13, marginBottom: 4 }}>
              Income
            </Text>
            <Text style={styles.income}>{formatCurrency(summary.totalIncome)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colours.textSecondary, fontSize: 13, marginBottom: 4 }}>
              Expenses
            </Text>
            <Text style={styles.expense}>{formatCurrency(summary.totalExpenses)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colours.border }}>
          <Text style={{ color: colours.textSecondary, fontSize: 12 }}>
            {summary.transactionCount.income + summary.transactionCount.expenses} transactions this period
          </Text>
        </View>
      </View>
      )}

      {/* Transactions List */}
      <Text style={[styles.header, { fontSize: 18, marginBottom: 8 }]}>
        Recent Transactions
      </Text>

      {loading ? (
        <View style={styles.list}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : transactions.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: colours.textSecondary, fontSize: 16 }}>
            No transactions yet
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {transactions.map((transaction) => (
            <View key={transaction._id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>{transaction.category}</Text>
                  {transaction.description && (
                    <Text style={[styles.itemDate, { marginTop: 2 }]}>
                      {transaction.description}
                    </Text>
                  )}
                  <Text style={styles.itemDate}>{formatDate(transaction.date)}</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: transaction.type === "income" ? colours.success : colours.error,
                  }}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            </View>
          ))}

          {hasMore && (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={colours.primary} />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
