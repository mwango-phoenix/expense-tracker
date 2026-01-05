import { StyleSheet } from "react-native";
import COLOURS from "../constants/colours";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: COLOURS.textPrimary,
    marginBottom: 15,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOURS.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOURS.border,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 12,
    color: COLOURS.textSecondary,
    marginBottom: 2,
  },
  centerLabelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOURS.textPrimary,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: COLOURS.textSecondary,
    flex: 1,
    marginRight: 10,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOURS.textPrimary,
  },
  barChartContainer: {
    backgroundColor: COLOURS.card,
    padding: 20,
    paddingTop: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOURS.border,
    minHeight: 280,
  },
  selectedBarInfo: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLOURS.border,
    alignItems: 'center',
  },
  selectedBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 4,
  },
  selectedBarLabel: {
    fontSize: 14,
    color: COLOURS.textSecondary,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  selectedBarValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOURS.textPrimary,
    marginBottom: 4,
  },
  selectedBarPercentage: {
    fontSize: 13,
    color: COLOURS.primary,
  },
});

export default styles;
