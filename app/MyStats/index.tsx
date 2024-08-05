import { View, Dimensions, StyleSheet } from "react-native";
import {
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import GeneralStats from './GeneralStats';

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#1E90FF",
  backgroundGradientTo: "#80c0ff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#0a86ff",
  }
}

const MyStats = () => (
  <View style={styles.container}>
    <ProgressChart
      data={{
        labels: ["Jan 2023 - Feb 2023"], // optional
        data: [0.8]
      }}
      width={Dimensions.get("window").width}
      height={100}
      strokeWidth={10}
      radius={32}
      chartConfig={chartConfig}
      hideLegend={false}
    />
    <LineChart
      data={{
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [
              1,
              5,
              3,
              4,
              1,
              2,
            ],
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
    <GeneralStats />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
});

export default MyStats;
