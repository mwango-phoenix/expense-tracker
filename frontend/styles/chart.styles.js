const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: colours.textPrimary,
    marginBottom: 15,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.cardBackground,
    padding: 15,
    borderRadius: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerLabelText: {
    fontSize: 12,
    color: colours.textSecondary
  },
  centerLabelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colours.textPrimary
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colours.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colours.textPrimary,
  },
});