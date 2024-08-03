import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { Header, Badge, Avatar } from 'react-native-elements';
import appTheme from '../appTheme';
import NotificationModal from '../components/NotificationsModal'; 
import { NotificationAPI } from '@/serverAPI/NotificationAPI';

const styles = StyleSheet.create({
  title: {
    color: appTheme.colors.white, 
    fontSize: 22, 
    fontFamily: 'Eras ITC', 
    fontStyle: 'italic', 
    fontWeight: 'bold' 
  },
  notifications: {
    width: 40,
    height: 40
  },
  headerContainer: {
    zIndex: 1000,
  }
});

export default function AppHeader() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationsNumber, setNotificationsNumber] = useState(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchNotificationsNumber = async () => {
    await NotificationAPI.getNotificationsNumber().then((res) => {
      setNotificationsNumber(res.data)
    });
  }

  useEffect(() => {
    fetchNotificationsNumber();

    const intervalId = setInterval(fetchNotificationsNumber, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Header
        backgroundColor={appTheme.colors.themeColor}
        leftComponent={
          <>
          
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={require('../assets/assistent.png')}
                style={styles.notifications}
              />
            <Badge value={notificationsNumber} status="error" containerStyle={{ position: 'absolute', top: -4, right: 1 }} />
            </TouchableOpacity>
          
          </>
        }
        centerComponent={{ 
          text: 'Beast Runner', 
          style: {...styles.title} 
        }}
        rightComponent={{ 
          icon: 'menu', 
          color: appTheme.colors.white 
        }}
      />
      <NotificationModal isVisible={isModalVisible} onClose={toggleModal} setNotificationsNumber={setNotificationsNumber}/>
    </View>
  );
}
