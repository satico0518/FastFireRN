import 'react-native-gesture-handler';
import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigator} from './src/navigator/DrawerNavigator';
import {LogBox} from 'react-native';
import {PermissionProvider} from './src/context/PermissionContext';
import {EmployeeAssistanceProvider} from './src/context/EmployeeAssistanceContext';
import {AuthProvider} from './src/context/AuthContext';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const AppState = ({children}: any) => (
  <PermissionProvider>
    <AuthProvider>
      <EmployeeAssistanceProvider>{children}</EmployeeAssistanceProvider>
    </AuthProvider>
  </PermissionProvider>
);

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <DrawerNavigator />
      </AppState>
    </NavigationContainer>
  );
};

export default App;
