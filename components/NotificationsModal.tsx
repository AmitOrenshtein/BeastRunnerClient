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
        <View style={styles.line} />
        {notifications.map((notification) =>
          <> 
            <View key={notification._id} style={styles.notification}>
              <Text>{`Workout Reminder for Today (${notification.date}) - ${notification.workout?.title}`}</Text>
              <Button labelStyle={styles.button} onPress={() => removeNotification(notification._id)}>
                x
              </Button>
            </View>
            <View style={styles.line} />
          </>
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
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  button: {
    fontSize: 20,
    color: 'black'
  },
  line: {
    borderBottomColor: Theme.colors.darkBlue,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 23
  }
});

export default NotificationModal;
