import * as React from 'react';
import {useContext} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen';
import { AssitanceScreen } from '../screens/AssitanceScreen';
import { PermissionContext } from '../context/PermissionContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { AuthContext } from '../context/AuthContext';

type StackNavigatorParams = {
    Login: undefined,
    Home: undefined,
    Assistance: undefined,
}

const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const StackNavigator = () => {
  const {permissions} = useContext(PermissionContext);
  const {authState} = useContext(AuthContext);

  if (permissions.locationStatus === 'unavailable') {
    return <LoadingScreen />;
  }

  return (
  <Stack.Navigator
    initialRouteName={authState.isLoggedIn ? 'Home' : 'Login'}
    screenOptions={{
      contentStyle: {backgroundColor: 'white'},
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
    <Stack.Screen
      name="Assistance"
      component={AssitanceScreen}
      options={{
        headerStyle: {backgroundColor: 'white'},
        headerTitleStyle: {color: 'white'},
        headerTitleAlign: 'center',
        title: 'Control de Asistencia',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
)};
