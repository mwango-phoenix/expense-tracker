import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "@/styles/create.styles";
import colours from "@/constants/colours";
import { Transaction } from "@/types";

interface TransactionCardProps {
  transaction: Transaction;
  type: "income" | "expense";
  onPress: (transaction: Transaction) => void;
}

export default function TransactionCard({
  transaction,
  type,
  onPress,
}: TransactionCardProps) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const color = type === "income" ? colours.success : colours.error;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.cardRow}>
        <View style={styles.cardContent}>
          <FontAwesome5
            name={transaction.icon}
            size={24}
            color={color}
            style={{ marginRight: 12 }}
          />
          <View style={styles.cardDetails}>
            <Text style={styles.text}>{transaction.category}</Text>
            {transaction.description && (
              <Text style={[styles.textSecondary, styles.cardDescription]}>
                {transaction.description}
              </Text>
            )}
            <Text style={[styles.textSecondary, styles.cardDate]}>
              {formatDate(transaction.date)}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: color,
            }}
          >
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
