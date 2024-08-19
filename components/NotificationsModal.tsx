import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Notification } from '@/app/types/notification';
import { NotificationAPI } from '@/serverAPI/NotificationAPI';
import Theme from '@/appTheme';
import { Button } from 'react-native-paper';

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  setNotificationsNumber: (notifications: number) => void;
}

const { width } = Dimensions.get('window');

const NotificationModal = (props: NotificationModalProps) => {
  const { isVisible, onClose, setNotificationsNumber } = props;

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    await NotificationAPI.getNotifications().then((res) => {
      setNotifications(res.data)
    });
  }

  useEffect(() => {
    if (isVisible) fetchNotifications();
  }, [isVisible])

  const removeNotification = async (_id: string) => {
    await NotificationAPI.deleteNotification(_id);
    await fetchNotifications();
  }

  useEffect(() => {
    setNotificationsNumber(notifications.length);
  }, [notifications])

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Hi it's Skyler!</Text>
        {notifications.map((notification) => 
          <View key={notification._id} style={styles.notification}>
            <Text>{`Workout Reminder for Today (${notification.date}) - ${notification.workout?.title}`}</Text>
            <Button onPress={() => removeNotification(notification._id)}>x</Button>
          </View>
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
    marginBottom: 30,
    marginTop: 10,
    color: Theme.colors.themeColor
  },
  notification: {
    display: 'flex',
    marginBottom: 20
  },
});

export default NotificationModal;
