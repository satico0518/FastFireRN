import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {Button, Text, View} from 'react-native';
import { styles } from '../styles/appTheme';

interface Props extends NativeStackScreenProps<any, any>{};

export const LoginScreen = ({navigation} : Props) => {
  return (
    <View style={styles.globalMargin}>
      <Text>LoginScreen</Text>
      <Button title='Login' onPress={() => navigation.replace('Home')}/>
    </View>
  );
};
