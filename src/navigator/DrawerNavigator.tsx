import React, {useContext, useEffect, useState} from 'react';

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  Asset,
} from 'react-native-image-picker';
import {StackNavigator} from './StackNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import {SettingsScreen} from '../screens/SettingsScreen';
import ffApi from '../api';
import {useNavigation} from '@react-navigation/native';

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
  const [tempUri, setTempUri] = useState<string>();
  useEffect(() => {
    setTempUri(user?.img);
  }, []);

  const handleLogOut = () => {
    logOut();
    navigation.closeDrawer();
    navigation.navigate('Login');
  };

  const uploadPhoto = async (data: Asset, uid: string) => {
    console.log('img size: ', data.fileSize);
    const body = {
      uid,
      type: data.type,
      base64: data.base64,
    };

    try {
      ffApi.put(`/uploads/avatar`, body);
    } catch (error) {
      console.log({error});
    }
  };

  const selectGalleryImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      async (resp: ImagePickerResponse) => {
        console.log('resp: asets', resp.assets);
        if (resp.didCancel) return;
        if (!resp.assets?.length) return;

        setTempUri(resp.assets[0].uri);
        // console.log('resp.assets: ', resp.assets);
        // const imgToUpload = {
        //   uri: resp.assets[0].uri,
        //   type: resp.assets[0].type,
        //   name: resp.assets[0].fileName,
        // };
        // const formData = new FormData();
        // const uid = user!._id;
        // formData.append('file', imgToUpload);
        // console.log('imgToUpload: ', imgToUpload);
        // const respose = await ffApi.put(`/uploads/avatar/${uid}`, formData, {
        //   headers: {
        //     'content-type': 'multipart/form-data',
        //   },
        // });
        // console.log('response: ', respose);
        // handleLogOut();
      },
    );
  };

  const takePhoto = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 750,
      quality: 0.5,
      cameraType: 'front',
      includeBase64: true,
    };
    try {
      const resp: ImagePickerResponse = await launchCamera(options);
      if (resp.didCancel) return;
      if (!resp.assets) return;

      setTempUri(resp.assets[0].uri);

      uploadPhoto(resp.assets[0], user?._id as string);
    } catch (error) {
      console.error('error xxx: ', error);
      Alert.alert('Error', 'Error subiendo imagen', [{text: 'ok'}]);
    }
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.avatarContainer}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          {/* <TouchableOpacity onPress={selectGalleryImage} style={{}}>
            <Icon name="image" size={15} color="#fff" />
          </TouchableOpacity> */}
          <View style={styles.imgWrapper}>
            {user?.img ? (
              <Image
                defaultSource={require('../assets/avatar.png')}
                source={{uri: tempUri}}
                borderRadius={50}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../assets/avatar.png')}
                style={styles.avatar}
              />
            )}
          </View>
          <TouchableOpacity onPress={takePhoto}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>
      <View style={styles.menuContainer}>
        {user?.role === 'ADMIN_ROLE' ||
          (user?.role === 'SUPERVISOR_ROLE' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Activate')}>
                <Icon name="person-add" color="red" size={20} />
                <Text style={styles.menuText}>Activar Usuarios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('RegisterOper')}>
                <Icon name="person-add" color="red" size={20} />
                <Text style={styles.menuText}>Registrar Ingresos</Text>
              </TouchableOpacity>
            </>
          ))}
        {user?.role === 'ADMIN_ROLE' ? (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Users')}>
              <Icon name="people" color="red" size={20} />
              <Text style={styles.menuText}>Administrar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Activate')}>
              <Icon name="person-add" color="red" size={20} />
              <Text style={styles.menuText}>Activar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('RegisterOper')}>
              <Icon name="color-wand" color="red" size={20} />
              <Text style={styles.menuText}>Registrar Ingresos</Text>
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
        {/* <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" color="red" size={20} />
          <Text style={styles.menuText}> Ajustes</Text>
        </TouchableOpacity> */}
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
  menuText: {
    fontSize: 15,
    marginLeft: 30,
    fontWeight: 'bold',
    color: '#3a3a3a',
  },
});
