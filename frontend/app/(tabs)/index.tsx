import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "@/styles/home.styles";
import colours from "@/constants/colours";
import { SkeletonCard, SkeletonSummaryCard } from "@/components/Skeleton";
import { Transaction, DashboardSummary } from "@/types";
import TransactionCard from "@/components/TransactionCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getPeriodRange, getPeriodLabel, formatDateRange } from "@/utils/dateRange";

export default function Index() {
  const { token, isCheckingAuth, refreshDashboard, logout } = useAuthStore() as { 
    token: string | null; 
    isCheckingAuth: boolean;
    refreshDashboard: number;
    logout: () => Promise<void>;
  };
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const monthRange = getPeriodRange('month');
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

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10}]}
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={colours.error} />
        </TouchableOpacity>
      </View>
      {/* Summary Card */}
      {loading ? (
        <SkeletonSummaryCard />
      ) : (
      <TouchableOpacity
        style={styles.balanceCard}
        onPress={() => router.push('/analytics')}
        activeOpacity={0.7}
      >
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colours.textSecondary, fontSize: 14, marginBottom: 4 }}>
              Net Balance
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colours.textSecondary, fontSize: 12, marginRight: 4 }}>
                View analytics
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colours.primary} />
            </View>
          </View>
          <Text style={{ color: colours.textSecondary, fontSize: 12, marginBottom: 4 }}>
            {getPeriodLabel('month')} ({formatDateRange(monthRange.start, monthRange.end)})
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
            <Text style={{ color: colours.textSecondary, fontSize: 13, marginBottom: 2 }}>
              Income
            </Text>
            <Text style={styles.income}>{formatCurrency(summary.totalIncome)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colours.textSecondary, fontSize: 13, marginBottom: 2}}>
              Expenses
            </Text>
            <Text style={styles.expense}>{formatCurrency(summary.totalExpenses)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: colours.border }}>
          <Text style={{ color: colours.textSecondary, fontSize: 12 }}>
            {summary.transactionCount.income + summary.transactionCount.expenses} transactions this month
          </Text>
        </View>
      </TouchableOpacity>
      )}

      {/* Transactions List */}
      <Text style={[styles.subHeader]}>
        Recent Transactions
      </Text>

      {loading ? (
        <View style={styles.list}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.list}>
          <Text style={{ color: colours.textSecondary, fontSize: 16 }}>
            No transactions yet
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              type={transaction.type}
              onPress={() => {}}
            />
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
