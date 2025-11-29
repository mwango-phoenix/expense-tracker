import { StyleSheet } from 'react-native';
import colours from '../constants/colours';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 20,
  },
  header: {
    color: colours.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: colours.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: colours.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colours.border,
  },
  balanceText: {
    color: colours.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  income: {
    color: colours.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  expense: {
    color: colours.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 12,
  },
  card: {
    backgroundColor: colours.card,
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colours.border,
  },
  itemText: {
    color: colours.textPrimary,
    fontSize: 16,
  },
  itemDate: {
    color: colours.textSecondary,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: colours.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  addButtonText: {
    color: colours.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
