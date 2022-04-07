import React from 'react';
import { Dimensions, View } from 'react-native';

export const Hr = () => (
  <View
    style={{
      width: Dimensions.get('screen').width * 0.9,
      borderBottomColor: '#eceaea',
      borderBottomWidth: 1,
      alignSelf: 'center',
    }}
  />
);
