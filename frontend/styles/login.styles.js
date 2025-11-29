
import { StyleSheet } from 'react-native';
import colours from '../constants/colours';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colours.background,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 32,
		borderRadius: 20,
		backgroundColor: colours.card,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: colours.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 2,
	},
	title: {
		color: colours.textPrimary,
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subtitle: {
		color: colours.textSecondary,
		fontSize: 16,
		marginBottom: 24,
		textAlign: 'center',
	},
	input: {
		backgroundColor: colours.surface,
		color: colours.textPrimary,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colours.border,
		padding: 12,
		marginVertical: 8,
		width: '100%',
		fontSize: 16,
	},
	button: {
		backgroundColor: colours.primary,
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginVertical: 12,
		width: '100%',
	},
	buttonText: {
		color: colours.background,
		fontWeight: 'bold',
		fontSize: 16,
	},
	errorText: {
		color: colours.error,
		fontSize: 14,
		marginTop: 4,
		textAlign: 'center',
	},
	link: {
		color: colours.secondary,
		fontSize: 15,
		marginTop: 16,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
});

export default styles;
