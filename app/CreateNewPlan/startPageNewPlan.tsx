import React from "react";
import { Text, View, Image } from "react-native";
import appTheme from '../../appTheme';
import { Card } from 'react-native-paper';

const StartPage = () => {

  return (
    <View>
      <Text style={{ fontSize: 30, fontWeight: 600, marginVertical: 20, textAlign: 'center', marginTop: 50, color: appTheme.colors.darkBlue}}>
        Befote Getting Started
      </Text>
      <Card.Content style={{borderColor: 'black', borderWidth: 2, borderRadius: 22, padding: 20, paddingHorizontal:25, margin: 30}}>
        <View style={{flexDirection: 'row', }}>
          <Image
            source={require('../../assets/assistent.png')}
            style={{ width: 50, height: 50, marginRight: 10 }} // Adjust width and height as needed
          />
          <Text style={{ fontSize: 20, fontWeight: '300', flex: 1 }}>
            Hi! My name is Skyler and I’m here to help you reach your goal!
          </Text>
        </View>
      </Card.Content>
      <Text style={{ fontSize: 15, fontWeight: '300', textAlign: 'center', marginHorizontal: 50}}>
      Our platform import your information from Google Fit in order to make the most suitable training plan for you!
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 40,}}>
      Hit Next and let's get started!
      </Text>
    </View>
  );
};

export default StartPage;
