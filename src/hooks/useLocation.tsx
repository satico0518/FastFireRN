import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

export interface Location {
  lat: number;
  long: number;
}

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({lat: 0, long: 0});

  const watchIdRef = useRef<number>();
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getCurrentLocation().then(loc => {
      if (isMounted.current) {
        setCurrentPosition(loc);
        setHasLocation(true);
      }
    });
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          resolve({lat: coords.latitude, long: coords.longitude});
        },
        err => {
          reject({err});
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
        },
      );
    });
  };

  const followUser = () => {
    watchIdRef.current = Geolocation.watchPosition(
      ({coords}) => {
        if (!isMounted.current) return;
        setCurrentPosition({lat: coords.latitude, long: coords.longitude});
      },
      err => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 100,
      },
    );
  };

  const stopFollowUser = () => {
    if (watchIdRef.current) Geolocation.clearWatch(watchIdRef.current);
  };

  return {
    hasLocation,
    currentPosition,
    followUser,
    getCurrentLocation,
    stopFollowUser,
  };
};
