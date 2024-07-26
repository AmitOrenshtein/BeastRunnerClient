import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import appTheme from '../appTheme';

export default function AppHeader() {
//        <TouchableOpacity onPress={() => navigation.openDrawer()}>

  return (
    <Header
      backgroundColor={appTheme.colors.themeColor}
      leftComponent={
        <TouchableOpacity>
          <Image
            source={require('../assets/assistent.png')}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      }
      centerComponent={{ 
        text: 'Beast Runner', 
        style: {  
          color: appTheme.colors.white, 
          fontSize: 22, 
          fontFamily: 'Eras ITC', 
          fontStyle: 'italic', 
          fontWeight: 'bold' 
        } 
      }}
      rightComponent={{ 
        icon: 'menu', 
        color: appTheme.colors.white 
      }}
    />
  );
}
