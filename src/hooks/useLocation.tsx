import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {AppState, AppStateStatus, NativeEventSubscription} from 'react-native';

export interface Location {
  lat: number;
  long: number;
}

export const useLocation = () => {
  const [appStatus, setAppStatus] = useState<AppStateStatus>('active');
  const [hasLocation, setHasLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({lat: 0, long: 0});

  const watchIdRef = useRef<number>();
  const subcriptionRef = useRef<NativeEventSubscription>();
  const isMounted = useRef<boolean>(true);

  if (isMounted.current) {
    subcriptionRef.current = AppState.addEventListener('change', setAppStatus);
  }

  useEffect(() => {
    isMounted.current = true;
    return () => {
      subcriptionRef.current?.remove();
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (appStatus === 'active') {
      getCurrentLocation().then(loc => {
        if (isMounted.current) {
          setCurrentPosition(loc);
          setHasLocation(true);
        }
      });
    }
  }, [appStatus]);

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
        distanceFilter: 50,
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
