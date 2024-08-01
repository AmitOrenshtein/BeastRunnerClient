import { PlanAPI } from '@/serverAPI/PlanAPI';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const NotificationModal = ({ isVisible, onClose }) => {

  const [todayWorkout, setTodayWorkout] = useState('gg');

  useEffect(() => {
    PlanAPI.getWorkout(new Date()).then((res) => {
      console.log(res)
      console.log(res.data[0].workout)
      setTodayWorkout(res.data[0].workout)
      })
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text>{todayWorkout}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  container: {
    width: width * 0.8,
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: '100%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40
  },
});

export default NotificationModal;
