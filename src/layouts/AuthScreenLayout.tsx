import React, { FC } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

export const AuthScreenLayout:FC = ({children}) => {

  return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        {children}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    width: Dimensions.get('screen').width * 0.8,
    height: 90,
  },
});
