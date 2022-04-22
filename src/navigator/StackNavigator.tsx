import * as React from 'react';
import {useContext} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {AssitanceScreen} from '../screens/AssitanceScreen';
import {PermissionContext} from '../context/PermissionContext';
import {LoadingScreen} from '../screens/LoadingScreen';
import {AuthContext} from '../context/AuthContext';
import {RegisterScreen} from '../screens/RegisterScreen';
import {ActivateScreen} from '../screens/ActivateScreen';
import {UsersScreen} from '../screens/UsersScreen';
import {UserDetailScreen} from '../screens/UserDetailScreen';

type StackNavigatorParams = {
  Login: undefined;
  Register: undefined;
  Activate: undefined;
  Users: undefined;
  UserDetail: undefined;
  Home: undefined;
  Assistance: undefined;
};

const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const StackNavigator = () => {
  const {permissions} = useContext(PermissionContext);
  const {status, user} = useContext(AuthContext);

  if (permissions.locationStatus === 'unavailable') {
    return <LoadingScreen />;
  }

  if (status === 'checking') return <LoadingScreen />;

  const getInitialRoute = () => {
    if (status === 'authenticated') {
      if (user?.role === 'ADMIN_ROLE') return 'Home';

      return 'Assistance';
    }
    return 'Login';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        contentStyle: {backgroundColor: 'white'},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Activate"
        component={ActivateScreen}
        options={{
          headerTitle: 'Activación de Usuarios',
          headerTintColor: '#535353',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Users"
        component={UsersScreen}
        options={{
          headerTitle: 'Administración Usuarios',
          headerTintColor: '#535353',
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{
          headerTitle: 'Detalle de Usuario',
          headerTintColor: '#535353',
        }}
      />
      <Stack.Screen
        name="Assistance"
        component={AssitanceScreen}
        options={{
          headerTitle: 'Registro de asistencia',
          headerTintColor: '#535353',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
