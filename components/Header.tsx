import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import appTheme from '../appTheme';

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
  }
});

export default function AppHeader() {

  return (
    <Header
      backgroundColor={appTheme.colors.themeColor}
      leftComponent={
        <TouchableOpacity>
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
  );
}
