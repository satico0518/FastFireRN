import React, {createContext, useEffect, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {PermissionStatus, request, PERMISSIONS, openSettings} from 'react-native-permissions';

export interface PermissionState {
  locationStatus: PermissionStatus;
}

export const permissionInitState: PermissionState = {
  locationStatus: 'unavailable',
};

type PermissionsContextProps = {
  permissions: PermissionState;
  askLocationPermissions: () => void;
  checkLocationPermissions: () => void;
};

export const PermissionContext = createContext({} as PermissionsContextProps);

export const PermissionProvider = ({children}: any) => {
  const [permissions, setPermissions] = useState(permissionInitState);

  useEffect(() => {
    checkLocationPermissions();
    const listener = AppState.addEventListener('change', state => {
      if (state !== 'active') return;

      checkLocationPermissions();
    });

    return () => listener.remove();
  }, []);

  const askLocationPermissions = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    if (permissions.locationStatus === 'blocked') {
        openSettings();
    }

    setPermissions({...permissions, locationStatus: permissionStatus});
  };

  const checkLocationPermissions = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
    setPermissions({...permissions, locationStatus: permissionStatus});
  };

  return (
    <PermissionContext.Provider
      value={{permissions, askLocationPermissions, checkLocationPermissions}}>
      {children}
    </PermissionContext.Provider>
  );
};
