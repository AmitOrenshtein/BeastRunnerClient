import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const StatisticsCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>54</Text>
        <Text style={styles.statLabel}>km</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>22:45</Text>
        <Text style={styles.statLabel}>hours</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>18</Text>
        <Text style={styles.statLabel}>trainings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Light grey background color
    padding: 20,
    borderRadius: 20,
    borderColor: '#E0E0E0', // Slightly darker border color
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E90FF', // DodgerBlue color
  },
  statLabel: {
    fontSize: 16,
    color: '#666666', // Grey color
  },
});

export default StatisticsCard;
