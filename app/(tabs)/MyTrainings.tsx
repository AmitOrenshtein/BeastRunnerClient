import { Text, View, StyleSheet } from "react-native";

export default function ProgressAndStats() {
    return (
        <View style={styles.container}>
            <Text>My trainings page!</Text>
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