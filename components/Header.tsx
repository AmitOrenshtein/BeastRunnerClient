import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { Header } from 'react-native-elements';
import appTheme from '../appTheme';
import NotificationModal from '../components/NotificationsModal'; // Import the custom slide-in component

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
    zIndex: 1000, // Ensure the header is above the modal
  }
});

export default function AppHeader() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.headerContainer}>
      <Header
        backgroundColor={appTheme.colors.themeColor}
        leftComponent={
          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={require('../assets/assistent.png')}
              style={styles.notifications}
            />
          </TouchableOpacity>
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
      <NotificationModal isVisible={isModalVisible} onClose={toggleModal} />
    </View>
  );
}
