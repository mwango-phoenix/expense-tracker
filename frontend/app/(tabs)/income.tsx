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
import { Income, INCOME_CATEGORIES } from "@/types";
import TransactionCard from "@/components/TransactionCard";
import TransactionModal from "@/components/TransactionModal";

export default function IncomePage() {
  const { token, isCheckingAuth, triggerDashboardRefresh } = useAuthStore() as {
    token: string | null;
    isCheckingAuth: boolean;
    triggerDashboardRefresh: () => void;
  };
  const insets = useSafeAreaInsets();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

  const fetchIncomes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/income?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setIncomes(data.incomes || []);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAuth && token) {
      fetchIncomes();
    } else if (!isCheckingAuth && !token) {
      setLoading(false);
    }
  }, [isCheckingAuth, token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchIncomes();
  }, []);

  const openCreateModal = () => {
    setEditingIncome(null);
    setModalVisible(true);
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setModalVisible(true);
  };

  const handleCardPress = (income: Income) => {
    openEditModal(income);
  };

  const handleSubmit = async (data: Omit<Income, "_id">) => {
    try {
      const url = editingIncome
        ? `${API_URL}/api/income/${editingIncome._id}`
        : `${API_URL}/api/income`;

      const response = await fetch(url, {
        method: editingIncome ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalVisible(false);
        setEditingIncome(null);
        fetchIncomes();
        triggerDashboardRefresh();
        Alert.alert(
          "Success",
          editingIncome ? "Income updated!" : "Income added!"
        );
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Failed to save income");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save income");
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Income",
      "Are you sure you want to delete this income?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/income/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.ok) {
                fetchIncomes();
                triggerDashboardRefresh();
                Alert.alert("Success", "Income deleted");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete income");
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Income</Text>
          <Text style={[styles.textSecondary, { fontSize: 16, marginTop: 4 }]}>
            Total:{" "}
            <Text style={{ color: colours.success, fontWeight: "bold" }}>
              {formatCurrency(totalIncome)}
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
        ) : incomes.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <FontAwesome5
              name="money-bill-wave"
              size={48}
              color={colours.textSecondary}
            />
            <Text
              style={[styles.textSecondary, { marginTop: 16, fontSize: 16 }]}
            >
              No income records yet
            </Text>
          </View>
        ) : (
          incomes.map((income) => (
            <TransactionCard
              key={income._id}
              transaction={{ ...income, type: "income" }}
              type="income"
              onPress={handleCardPress}
            />
          ))
        )}
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        type="income"
        categories={INCOME_CATEGORIES}
        editingTransaction={editingIncome}
        onClose={() => {
          setModalVisible(false);
          setEditingIncome(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </View>
  );
}
