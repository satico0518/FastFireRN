import * as React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen';

type StackNavigatorParams = {
    Login: undefined,
    Home: undefined
}

const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      contentStyle: {backgroundColor: 'black'},
    }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerStyle: {backgroundColor: 'black'},
        headerTitleStyle: {color: 'white'},
        headerTitleAlign: 'center'
      }}
    />
  </Stack.Navigator>
);
