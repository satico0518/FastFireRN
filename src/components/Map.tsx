import React from 'react';
import {Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export const Map = ({currentPosition}: any) => {
  return (
    <MapView
      showsUserLocation
      followsUserLocation
      userInterfaceStyle="dark"
      style={{height: Dimensions.get('screen').height * 0.2}}
      initialRegion={{
        latitude: currentPosition.lat,
        longitude: currentPosition.long,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      }}>
      <Marker
        coordinate={{
          latitude: currentPosition.lat,
          longitude: currentPosition.long,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
        title="Usted está aquí"
        description="En este punto se guardará su registro"
        image={require('../assets/pin.png')} 
      />
    </MapView>
  );
};
