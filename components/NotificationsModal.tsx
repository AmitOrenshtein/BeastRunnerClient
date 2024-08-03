import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, AppState } from 'react-native';
import Modal from 'react-native-modal';
import { Notification } from '@/app/types/notification';
import { NotificationAPI } from '@/serverAPI/NotificationAPI';

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
