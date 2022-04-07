import {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [initialPosition, setInitialPosition] = useState({lat: 0, long: 0});

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        setInitialPosition({lat: coords.latitude, long: coords.longitude});
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
  }, []);

  return {
    hasLocation,
    initialPosition,
  };
};
