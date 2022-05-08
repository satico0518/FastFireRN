import React, {useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';

export const Map = () => {
  const mapViewRef = useRef<MapView>();
  const {currentPosition, followUser, stopFollowUser} = useLocation();

  useEffect(() => {
    mapViewRef.current?.animateCamera({
      center: {latitude: currentPosition.lat, longitude: currentPosition.long},
    });
  }, [currentPosition]);

  useEffect(() => {    
    followUser();

    return () => { stopFollowUser(); };
  }, []);

  return (
    <MapView
      ref={el => (mapViewRef.current = el!)}
      showsUserLocation
      followsUserLocation
      userInterfaceStyle="dark"
      style={{height: Dimensions.get('screen').height * 0.2}}
      initialRegion={{
        latitude: currentPosition.lat,
        longitude: currentPosition.long,
        latitudeDelta: 0.00099,
        longitudeDelta: 0.00099,
      }}>
      <Marker
        coordinate={{
          latitude: currentPosition.lat,
          longitude: currentPosition.long,
          latitudeDelta: 0.00099,
          longitudeDelta: 0.00099,
        }}
        title="Usted está aquí"
        description="En este punto se guardará su registro"
        image={require('../assets/pin.png')}
      />
    </MapView>
  );
};
