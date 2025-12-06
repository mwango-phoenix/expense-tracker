// Zustand store for managing authentication state in the app.
// Use useAuthStore() in components to access or update authentication status.
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.API_URL;

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  refreshDashboard: 0, // Counter to trigger dashboard refresh

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error fetching data");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`http://10.0.2.2:3001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error inserting data");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user, isCheckingAuth: false });
    } catch (error) {
      console.log("Auth check failed:", error);
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ token: null, user: null });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  },

  triggerDashboardRefresh: () => {
    set((state: any) => ({ refreshDashboard: state.refreshDashboard + 1 }));
  },
}));
