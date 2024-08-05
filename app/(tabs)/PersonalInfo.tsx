import { Text, View, StyleSheet } from "react-native";
import CreateNewPlan from "../CreateNewPlan";
import MyStats from "../MyStats";

export default function MyTraining() {
    return (
        <View style={styles.container}>
            {/* <CreateNewPlan /> */}
            <MyStats />
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