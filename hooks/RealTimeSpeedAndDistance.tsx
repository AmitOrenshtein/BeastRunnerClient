import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useRealTimeSpeed() {
    const [speed, setSpeed] = useState<number>(0);

    useEffect(() => {
      let subscription: Location.LocationSubscription;
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error("Permission to access location was denied");
          return;
        }
  
        Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 2, timeInterval: 1000}, (location) => {
          if(location.coords.speed) {
            setSpeed(Math.round(location.coords.speed * 100) / 100);
          }
        }).then((locationSubscription => {
          subscription = locationSubscription;
        }));
      })();
      return () => {
        if(subscription) {
          subscription.remove();
        }
      };
    }, []);

    return speed;
}


export function useRealTimeDistance() {
  const [distance, setDistance] = useState(0);
  let lastPosition: coords | undefined = undefined;
  let totalDistance = 0;

  useEffect(() => {
    let subscription: Location.LocationSubscription;
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error("Permission to access location was denied");
        return;
      }

      Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 10, timeInterval: 1000}, (location) => {
        if(location.coords) {
          let currPosition: coords = {lat:location.coords.latitude, long:location.coords.longitude};
          if(lastPosition) {
            totalDistance += computeDistance(lastPosition, currPosition);
            setDistance(Math.floor(totalDistance * 1000) / 1000);
          }
          lastPosition = currPosition;
        }
      }).then((locationSubscription => {
        subscription = locationSubscription;
      }));
    })();
    return () => {
      if(subscription) {
        subscription.remove();
      }
    };
  }, []);

  return distance;
}

interface coords {
  lat: number,
  long: number
}

function computeDistance(a: coords, b: coords) {
  const prevLatInRad = toRad(a.lat);
  const prevLongInRad = toRad(a.long);
  const latInRad = toRad(b.lat);
  const longInRad = toRad(b.long);

  return (
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
    )
  );
}

function toRad(angle: number) {
  return (angle * Math.PI) / 180;
}