import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator,
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

export default function Income() {
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

  // Form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("money-check-alt");

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

  const resetForm = () => {
    setAmount("");
    setCategory("Salary");
    setDescription("");
    setSelectedIcon("money-check-alt");
    setEditingIncome(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setAmount(income.amount.toString());
    setCategory(income.category);
    setDescription(income.description || "");
    setSelectedIcon(income.icon);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      category,
      description,
      icon: selectedIcon,
      date: new Date().toISOString(),
    };

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
        body: JSON.stringify(incomeData),
      });

      if (response.ok) {
        setModalVisible(false);
        resetForm();
        fetchIncomes();
        triggerDashboardRefresh();
        Alert.alert("Success", editingIncome ? "Income updated!" : "Income added!");
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
    Alert.alert("Delete Income", "Are you sure you want to delete this income?", [
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
    ]);
  };

  const selectCategory = (cat: typeof INCOME_CATEGORIES[0]) => {
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

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View>
          <Text style={styles.title}>Income</Text>
          <Text style={[styles.textSecondary, { fontSize: 16, marginTop: 4 }]}>
            Total: <Text style={{ color: colours.success, fontWeight: "bold" }}>{formatCurrency(totalIncome)}</Text>
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
        ) : incomes.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <FontAwesome5 name="money-bill-wave" size={48} color={colours.textSecondary} />
            <Text style={[styles.textSecondary, { marginTop: 16, fontSize: 16 }]}>No income records yet</Text>
          </View>
        ) : (
          incomes.map((income) => (
            <View key={income._id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name={income.icon} size={24} color={colours.success} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{income.category}</Text>
                    {income.description && (
                      <Text style={[styles.textSecondary, { marginTop: 2 }]}>{income.description}</Text>
                    )}
                    <Text style={[styles.textSecondary, { marginTop: 4, fontSize: 12 }]}>{formatDate(income.date)}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: colours.success }}>
                    {formatCurrency(income.amount)}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <TouchableOpacity onPress={() => openEditModal(income)} style={{ marginRight: 12 }}>
                      <FontAwesome5 name="edit" size={18} color={colours.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(income._id)}>
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
              {editingIncome ? "Edit Income" : "Add Income"}
            </Text>

            <ScrollView>
              <Text style={[styles.textSecondary, { marginBottom: 8 }]}>Category</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
                {INCOME_CATEGORIES.map((cat) => (
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
                  <Text style={styles.buttonText}>{editingIncome ? "Update" : "Add"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}