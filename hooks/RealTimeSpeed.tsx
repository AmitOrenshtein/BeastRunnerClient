import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useRealTimeSpeed() {
    const [speed, setSpeed] = useState<number>(0);

    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error("Permission to access location was denied");
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000}, (location) => {
          if(location.coords.speed) {
              setSpeed(Math.round(location.coords.speed * 100) / 100);
          }
      });
      })();
    }, []);

    return speed;
}