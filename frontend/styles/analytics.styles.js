import { StyleSheet } from 'react-native';
import colours from '../constants/colours';

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colours.textSecondary,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colours.textPrimary,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colours.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  insightsContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colours.border,
    paddingBottom: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colours.textPrimary,
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: colours.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colours.border,
  },
  insightLabel: {
    fontSize: 13,
    color: colours.textSecondary,
    marginBottom: 6,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colours.textPrimary,
    marginBottom: 4,
  },
  insightAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: colours.textPrimary,
    marginBottom: 4,
  },
  insightPercentage: {
    fontSize: 14,
    color: colours.textSecondary,
  },
  chartToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colours.card,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colours.border,
  },
  chartToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  chartToggleButtonActive: {
    backgroundColor: colours.primary,
  },
  weeklyComparisonDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colours.border,
  },
  weeklyComparisonText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  weeklyComparisonSubtext: {
    fontSize: 13,
    color: colours.textSecondary,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colours.border,
  },
  accordionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accordionItemLabel: {
    fontSize: 14,
    color: colours.textSecondary,
  },
  accordionItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colours.textPrimary,
  },
});

export default styles;
