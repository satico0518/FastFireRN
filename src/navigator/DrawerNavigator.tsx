import React, {useContext} from 'react';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackNavigator} from './StackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';

interface Props extends DrawerScreenProps<any, any> {}

const Drawer = createDrawerNavigator();

export const DrawerNavigator = ({navigation}: Props) => {
  const {authState} = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomMenu {...props} />}
      screenOptions={{headerShown: authState.isLoggedIn}}>
      <Drawer.Screen
        name="Stack"
        component={StackNavigator}
        options={{title: 'FastFire App', headerTitleAlign: 'center'}}
      />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerTitle: 'Ajustes'}}
      />
    </Drawer.Navigator>
  );
};

const CustomMenu = ({navigation}: DrawerContentComponentProps) => {
  const {authState, setAuthState} = useContext(AuthContext);

  const handleLogOut = () => {
    setAuthState({
      ...authState,
      isLoggedIn: false,
    });
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: 'https://img2.freepng.es/20180623/iqh/kisspng-computer-icons-avatar-social-media-blog-font-aweso-avatar-icon-5b2e99c40ce333.6524068515297806760528.jpg',
            width: 100,
            height: 100,
          }}
        />
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuText}>
            <Icon name="star-outline" color="red" size={40} /> Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Assistance')}>
          <Text style={styles.menuText}>Asistencia</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuText}>Ajustes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogOut}>
          <Text style={styles.menuText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {alignItems: 'center'},
  menuContainer: {marginHorizontal: 10, paddingVertical: 10},
  menuText: {fontSize: 20},
});
