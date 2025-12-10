import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "@/styles/create.styles";
import colours from "@/constants/colours";
import DatePicker from "@/components/DatePicker";
import { Transaction } from "@/types";

interface Category {
  name: string;
  icon: string;
}

interface TransactionModalProps {
  visible: boolean;
  type: "income" | "expense";
  categories: Category[];
  editingTransaction: Omit<Transaction, "type"> | null;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "_id" | "type">) => void;
  onDelete: (id: string) => void;
}

export default function TransactionModal({
  visible,
  type,
  categories,
  editingTransaction,
  onClose,
  onSubmit,
  onDelete,
}: TransactionModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<Omit<Transaction, "_id" | "type">>({
    amount: 0,
    category: categories[0]?.name || "",
    title: "",
    description: "",
    icon: categories[0]?.icon || "",
    date: new Date().toISOString(),
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        title: editingTransaction.title || "",
        description: editingTransaction.description || "",
        icon: editingTransaction.icon,
        date: editingTransaction.date,
      });
    } else {
      setFormData({
        amount: 0,
        category: categories[0]?.name || "",
        title: "",
        description: "",
        icon: categories[0]?.icon || "",
        date: new Date().toISOString(),
      });
    }
  }, [editingTransaction, visible, categories]);

  const handleSubmit = () => {
    if (!formData.amount || formData.amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (editingTransaction) {
      onDelete(editingTransaction._id);
    }
  };

  const selectCategory = (cat: Category) => {
    setFormData((prev) => ({
      ...prev,
      category: cat.name,
      icon: cat.icon,
    }));
  };

  const typeColor = type === "income" ? colours.success : colours.error;
  const title = editingTransaction
    ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
    : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={styles.modalCard}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={styles.title}>{title}</Text>
            {editingTransaction && (
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome5 name="trash" size={20} color={colours.error} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView>
            <Text style={[styles.textSecondary, { marginBottom: 8 }]}>
              Category
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={{
                    backgroundColor:
                      formData.category === cat.name
                        ? colours.primary
                        : colours.surface,
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
                    color={
                      formData.category === cat.name
                        ? colours.background
                        : colours.textPrimary
                    }
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color:
                        formData.category === cat.name
                          ? colours.background
                          : colours.textPrimary,
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.textSecondary]}>
              Title
            </Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
            />

            <Text style={[styles.textSecondary]}>
              Amount
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colours.textDisabled}
              keyboardType="decimal-pad"
              value={formData.amount ? formData.amount.toString() : ""}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(text) || 0,
                }))
              }
            />

            <Text style={[styles.textSecondary]}>
              Date
            </Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: colours.textPrimary }}>
                {new Date(formData.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </TouchableOpacity>
            <DatePicker
              visible={showDatePicker}
              date={new Date(formData.date)}
              onDateChange={(selectedDate: Date) => {
                setFormData((prev) => ({
                  ...prev,
                  date: selectedDate.toISOString(),
                }));
              }}
              onClose={() => {
                setShowDatePicker(false);
              }}
            />

            <Text style={[styles.textSecondary]}>
              Description (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { minHeight: 80, textAlignVertical: "top" },
              ]}
              placeholder="Add notes..."
              placeholderTextColor={colours.textDisabled}
              multiline
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
            />

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    marginRight: 8,
                    backgroundColor: colours.surface,
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[styles.buttonText, { color: colours.textPrimary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginLeft: 8 }]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {editingTransaction ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
