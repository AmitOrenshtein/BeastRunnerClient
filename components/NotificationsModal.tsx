import { PlanAPI } from '@/serverAPI/PlanAPI';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, AppState } from 'react-native';
import Modal from 'react-native-modal';
//import * as BackgroundFetch from 'expo-background-fetch';
import { Notification } from '@/app/types/notification';
import { NotificationAPI } from '@/serverAPI/NotificationAPI';

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
//const BACKGROUND_FETCH_TASK = 'background-fetch';

const NotificationModal = (props: NotificationModalProps) => {
  const { isVisible, onClose } = props;

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    await NotificationAPI.getNotifications().then((res) => {
      setNotifications(res.data)
    });
  }

  useEffect(() => {
    fetchNotifications();
  }, [])

  // TODO: get notification number when the drawer is closed
  // useEffect(() => {
  //   const registerBackgroundFetch = async () => {
  //     try {
  //       await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  //         minimumInterval: 60 * 1440, //  24 hours
  //         stopOnTerminate: false,
  //         startOnBoot: true,
  //       });
  //     } catch (error) {
  //       console.error('Error registering background fetch task:', error);
  //     }
  //   };

  //   registerBackgroundFetch();

  //   const now = new Date();
  //   const targetTime = new Date();
  //   targetTime.setHours(16, 26, 0, 0);
  //   const delay = targetTime.getTime() - now.getTime();
  //   if (delay > 0) {
  //     setTimeout(fetchTodaysWorkout, delay);
  //   }

  //   return () => {
  //     BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  //   };
  // }, [])

  const removeNotification = async (_id: string) => {
    await NotificationAPI.deleteNotification(_id);
    await fetchNotifications();
  }

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
        {notifications.map((notification) => 
          <div key={notification._id}>
            <button onClick={() => removeNotification(notification._id)}>x</button>
            <Text>{notification.workout}</Text>
          </div>
        )}
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
