import { Text, View, StyleSheet } from "react-native";

export default function HomePage() {
    return (
        <View style={styles.container}>
            <Text>This is the home page!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });