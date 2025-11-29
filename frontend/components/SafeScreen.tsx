import { View, StyleSheet } from "react-native";
// inset value to represent safe area boundaries fo a device screen
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLOURS from "../constants/colours";


export default function SafeScreen({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOURS.background,
    }, 
});
