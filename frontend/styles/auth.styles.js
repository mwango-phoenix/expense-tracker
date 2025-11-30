import { StyleSheet } from "react-native";
import COLOURS from "../constants/colours";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 32,
    borderRadius: 20,
    backgroundColor: COLOURS.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLOURS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: COLOURS.textPrimary,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOURS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOURS.border,
    paddingHorizontal: 12,
    marginVertical: 8,
    width: "100%",
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: COLOURS.textPrimary,
  },
  inputIcon: {
    marginRight: 8,
    color: COLOURS.primary,
  },
  button: {
    backgroundColor: COLOURS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
  },
  buttonText: {
    color: COLOURS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: COLOURS.error,
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  link: {
    color: COLOURS.primary,
    fontSize: 15,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLOURS.textSecondary,
    marginRight: 5,
  },
});

export default styles;
