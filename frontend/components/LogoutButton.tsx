import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Ionicons } from "@expo/vector-icons";
import COLOURS from "../constants/colours";

export default function LogoutButton() {
  const { logout } = useAuthStore() as { logout: () => Promise<void> };

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLOURS.background} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: COLOURS.error,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    marginVertical: 12,
  },
  logoutText: {
    color: COLOURS.background,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});