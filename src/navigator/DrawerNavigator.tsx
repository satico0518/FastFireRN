import React, {useContext} from 'react';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackNavigator} from './StackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import { SettingsScreen } from '../screens/SettingsScreen';

interface Props extends DrawerScreenProps<any, any> {}

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const {status} = useContext(AuthContext);
  return (
    <Drawer.Navigator
      drawerContent={props =>
        status === 'authenticated' ? <CustomMenu {...props} /> : <Text></Text>
      }
      screenOptions={{headerShown: status === 'authenticated'}}>
      <Drawer.Screen
        name="Stack"
        component={StackNavigator}
        options={{title: 'FastFire App', headerTitleAlign: 'center'}}
      />
      <Drawer.Screen
      name="Settings"
      component={SettingsScreen}
      options={{title: 'Settings', headerTitleAlign: 'center'}}
    />
    </Drawer.Navigator>
  );
};

const CustomMenu = ({navigation}: DrawerContentComponentProps) => {
  const {logOut, user} = useContext(AuthContext);
  const handleLogOut = () => {
    logOut();
    navigation.closeDrawer();
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.avatarContainer}>
        <View style={styles.imgWrapper}>
          <Image
            style={styles.avatar}
            source={require('../assets/avatar.png')}
          />
        </View>
        <TouchableOpacity
          style={{position: 'relative', marginTop: -25, marginLeft: 95}}>
          <Icon name="camera" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>
      <View style={styles.menuContainer}>
        {user?.role === 'ADMIN_ROLE' ? (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Activate')}>
              <Icon name="person-add" color="red" size={20} />
              <Text style={styles.menuText}>Activar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Users')}>
              <Icon name="people" color="red" size={20} />
              <Text style={styles.menuText}>Administrar Usuarios</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Assistance')}>
              <Icon name="construct" color="red" size={20} />
              <Text style={styles.menuText}> Asistencia</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" color="red" size={20} />
          <Text style={styles.menuText}> Ajustes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogOut}>
          <Icon name="log-out" color="red" size={20} />
          <Text style={styles.menuText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fc0000',
  },
  avatar: {width: 60, height: 60},
  imgWrapper: {
    padding: 5,
    borderColor: '#ebebeb',
    borderWidth: 5,
    borderRadius: 100,
  },
  userName: {fontSize: 18, fontWeight: '700', color: '#ebebeb', marginTop: 7},
  menuContainer: {marginHorizontal: 10, paddingVertical: 10, marginTop: 20},
  menuItem: {marginVertical: 10, flexDirection: 'row'},
  menuText: {fontSize: 15, marginLeft: 30, fontWeight: 'bold'},
});
