import {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

export interface Location {
  lat: number;
  long: number;
}

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({lat: 0, long: 0});
  useEffect(() => getCurrentLocation(), []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        setCurrentPosition({lat: coords.latitude, long: coords.longitude});
        setHasLocation(true);
      },
      err => {
        setHasLocation(false);
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  return {
    hasLocation,
    currentPosition,
    getCurrentLocation,
  };
};
