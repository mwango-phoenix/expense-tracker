import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
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

export default function Expense() {
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

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("utensils");

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

  const resetForm = () => {
    setAmount("");
    setCategory("Food");
    setDescription("");
    setSelectedIcon("utensils");
    setEditingExpense(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDescription(expense.description || "");
    setSelectedIcon(expense.icon);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      icon: selectedIcon,
      date: new Date().toISOString(),
    };

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
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        setModalVisible(false);
        resetForm();
        fetchExpenses();
        triggerDashboardRefresh();
        Alert.alert("Success", editingExpense ? "Expense updated!" : "Expense added!");
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
    Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
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
    ]);
  };

  const selectCategory = (cat: typeof EXPENSE_CATEGORIES[0]) => {
    setCategory(cat.name);
    setSelectedIcon(cat.icon);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={[styles.textSecondary, { fontSize: 16, marginTop: 4 }]}>
            Total: <Text style={{ color: colours.error, fontWeight: "bold" }}>{formatCurrency(totalExpense)}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { paddingHorizontal: 20, paddingVertical: 10 }]}
          onPress={openCreateModal}
        >
          <Text style={styles.buttonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colours.primary} />
        }
      >
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
        ) : expenses.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <FontAwesome5 name="wallet" size={48} color={colours.textSecondary} />
            <Text style={[styles.textSecondary, { marginTop: 16, fontSize: 16 }]}>No expense records yet</Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <View key={expense._id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name={expense.icon} size={24} color={colours.error} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{expense.category}</Text>
                    {expense.description && (
                      <Text style={[styles.textSecondary, { marginTop: 2 }]}>{expense.description}</Text>
                    )}
                    <Text style={[styles.textSecondary, { marginTop: 4, fontSize: 12 }]}>{formatDate(expense.date)}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: colours.error }}>
                    {formatCurrency(expense.amount)}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <TouchableOpacity onPress={() => openEditModal(expense)} style={{ marginRight: 12 }}>
                      <FontAwesome5 name="edit" size={18} color={colours.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(expense._id)}>
                      <FontAwesome5 name="trash" size={18} color={colours.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View
            style={{
              backgroundColor: colours.card,
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text style={[styles.title, { marginBottom: 16 }]}>
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </Text>

            <ScrollView>
              <Text style={[styles.textSecondary, { marginBottom: 8 }]}>Category</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.name}
                    style={{
                      backgroundColor: category === cat.name ? colours.primary : colours.surface,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                      margin: 4,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => selectCategory(cat)}
                  >
                    <FontAwesome5
                      name={cat.icon}
                      size={16}
                      color={category === cat.name ? colours.background : colours.textPrimary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: category === cat.name ? colours.background : colours.textPrimary }}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.textSecondary, { marginBottom: 8 }]}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={colours.textDisabled}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={[styles.textSecondary, { marginBottom: 8 }]}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                placeholder="Add notes..."
                placeholderTextColor={colours.textDisabled}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginRight: 8, backgroundColor: colours.surface }]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={[styles.buttonText, { color: colours.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 8 }]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>{editingExpense ? "Update" : "Add"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}