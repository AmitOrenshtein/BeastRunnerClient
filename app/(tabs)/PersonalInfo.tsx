import { View, StyleSheet } from "react-native";
import MyStats from "../MyStats";

export default function MyTraining() {
  return (
    <View style={styles.container}>
      <MyStats />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
