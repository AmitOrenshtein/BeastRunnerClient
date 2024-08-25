import React, { FC } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GeneralStatsI } from "./types";

const StatisticsCard: FC<GeneralStatsI> = ({
  totalCompletedDistance,
  totalCompletedTime,
  trainingsDone,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalCompletedDistance}</Text>
        <Text style={styles.statLabel}>km</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalCompletedTime}</Text>
        <Text style={styles.statLabel}>minutes</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{trainingsDone}</Text>
        <Text style={styles.statLabel}>trainings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Light grey background color
    padding: 20,
    borderRadius: 20,
    borderColor: "#E0E0E0", // Slightly darker border color
    borderWidth: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E90FF", // DodgerBlue color
  },
  statLabel: {
    fontSize: 16,
    color: "#666666", // Grey color
  },
});

export default StatisticsCard;
