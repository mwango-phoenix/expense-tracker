
import { StyleSheet } from 'react-native';
import COLOURS from '../constants/colours';

// Styles for key components in a minimalist, chill expense tracker
const styles = StyleSheet.create({
	// Main app container
	container: {
		flex: 1,
		backgroundColor: COLOURS.background,
		padding: 20,
	},

	// Card for expense/income items
	card: {
		backgroundColor: COLOURS.card,
		borderRadius: 12,
		padding: 16,
		marginVertical: 8,
		shadowColor: COLOURS.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 2,
		borderWidth: 1,
		borderColor: COLOURS.border,
	},

	// Title text (e.g., section headers)
	title: {
		color: COLOURS.textPrimary,
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 8,
	},

	// Regular text
	text: {
		color: COLOURS.textPrimary,
		fontSize: 16,
	},
	textSecondary: {
		color: COLOURS.textSecondary,
		fontSize: 14,
	},

	// Input fields
	input: {
		backgroundColor: COLOURS.surface,
		color: COLOURS.textPrimary,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLOURS.border,
		padding: 12,
		marginVertical: 8,
		fontSize: 16,
	},

	// Button styles
	button: {
		backgroundColor: COLOURS.primary,
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginVertical: 8,
	},
	buttonText: {
		color: COLOURS.background,
		fontWeight: 'bold',
		fontSize: 16,
	},
	buttonSecondary: {
		backgroundColor: COLOURS.secondary,
	},

	// List container
	list: {
		marginTop: 12,
	},

	// Status badges
	statusIncome: {
		backgroundColor: COLOURS.success,
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 2,
		alignSelf: 'flex-start',
	},
	statusExpense: {
		backgroundColor: COLOURS.error,
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 2,
		alignSelf: 'flex-start',
	},
	statusText: {
		color: COLOURS.background,
		fontSize: 12,
		fontWeight: 'bold',
	},

	// Divider
	divider: {
		height: 1,
		backgroundColor: COLOURS.divider,
		marginVertical: 12,
	},

	// Modal overlay
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: COLOURS.overlay,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default styles;
