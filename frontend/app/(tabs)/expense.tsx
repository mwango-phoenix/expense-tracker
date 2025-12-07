import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "@/styles/create.styles";
import colours from "@/constants/colours";
import { FontAwesome5 } from "@expo/vector-icons";
import { SkeletonCard } from "@/components/Skeleton";
import { Expense, EXPENSE_CATEGORIES } from "@/types";
import TransactionCard from "@/components/TransactionCard";
import TransactionModal from "@/components/TransactionModal";

export default function ExpensePage() {
  const { token, isCheckingAuth, triggerDashboardRefresh } = useAuthStore() as {
    token: string | null;
    isCheckingAuth: boolean;
    triggerDashboardRefresh: () => void;
  };
  const insets = useSafeAreaInsets();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expense?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAuth && token) {
      fetchExpenses();
    } else if (!isCheckingAuth && !token) {
      setLoading(false);
    }
  }, [isCheckingAuth, token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, []);

  const openCreateModal = () => {
    setEditingExpense(null);
    setModalVisible(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setModalVisible(true);
  };

  const handleCardPress = (expense: Expense) => {
    openEditModal(expense);
  };

  const handleSubmit = async (data: Omit<Expense, "_id">) => {
    try {
      const url = editingExpense
        ? `${API_URL}/api/expense/${editingExpense._id}`
        : `${API_URL}/api/expense`;

      const response = await fetch(url, {
        method: editingExpense ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalVisible(false);
        setEditingExpense(null);
        fetchExpenses();
        triggerDashboardRefresh();
        Alert.alert(
          "Success",
          editingExpense ? "Expense updated!" : "Expense added!"
        );
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Failed to save expense");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save expense");
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/expense/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.ok) {
                fetchExpenses();
                triggerDashboardRefresh();
                Alert.alert("Success", "Expense deleted");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete expense");
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={[styles.textSecondary, { fontSize: 16, marginTop: 4 }]}>
            Total:{" "}
            <Text style={{ color: colours.error, fontWeight: "bold" }}>
              {formatCurrency(totalExpense)}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            { paddingHorizontal: 15, paddingVertical: 5, marginVertical: 0 },
          ]}
          onPress={openCreateModal}
        >
          <Text style={styles.buttonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colours.primary}
          />
        }
      >
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
        ) : expenses.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <FontAwesome5
              name="wallet"
              size={48}
              color={colours.textSecondary}
            />
            <Text
              style={[styles.textSecondary, { marginTop: 16, fontSize: 16 }]}
            >
              No expense records yet
            </Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <TransactionCard
              key={expense._id}
              transaction={{ ...expense, type: "expense" }}
              type="expense"
              onPress={handleCardPress}
            />
          ))
        )}
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        type="expense"
        categories={EXPENSE_CATEGORIES}
        editingTransaction={editingExpense}
        onClose={() => {
          setModalVisible(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
}
