import { Text, View, StyleSheet } from "react-native";

export default function MyTraining() {
    return (
        <View style={styles.container}>
            <Text>Personal data page</Text>
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