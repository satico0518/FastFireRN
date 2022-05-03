import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TabBar, TabView} from 'react-native-tab-view';
import ffApi from '../api';
import {TurnsRoute} from '../components/TurnsRoute';
import {User} from '../interfaces/app-interfaces';
import Icon from 'react-native-vector-icons/Ionicons';
import {translateRoles} from '../utils';
import {deleteUser} from '../services/users';

export const UserDetailScreen = ({route, navigation}: any) => {
  const {
    _id,
    identification,
    name,
    role,
    createdDate,
    isActive,
    img,
    deviceIdFailed,
  }: User = route.params.user;
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const [routes] = useState([
    {key: 'turns', title: 'Turnos'},
    {key: 'payroll', title: 'Nomina'},
    {key: 'edit', title: 'Editar'},
  ]);

  const handleChangeDeviceId = () => {
    Alert.alert(
      'Aviso!',
      'El usuario intenta cambiar su dispositivo, autoriza el cambio?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Autorizar',
          onPress: async () => {
            try {
              await ffApi.put('auth/device', {
                uid: _id,
                deviceId: deviceIdFailed,
              });
              Alert.alert(
                'Aviso!',
                'Dispositivo cambiado, notifíquele al usuario que ya puede ingresar con el nuevo dispositivo',
                [
                  {
                    text: 'Ok',
                    onPress: () => {
                      navigation.goBack();
                      return;
                    },
                  },
                ],
                {
                  onDismiss: () => {
                    navigation.goBack();
                  },
                },
              );
            } catch (error) {
              Alert.alert('Error', 'Error al intentar cambiar dispositivo', [
                {
                  text: 'Ok',
                  onPress: () => {
                    return;
                  },
                },
              ]);
            }
          },
        },
      ],
    );
  };

  const PayrolldRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ececec'}}>
      <Text>Nómina</Text>
    </View>
  );

  const EditRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ececec'}}>
      <Text>Editar</Text>
    </View>
  );

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'turns':
        return <TurnsRoute _id={_id} />;
      case 'payroll':
        return <PayrolldRoute />;
      case 'edit':
        return <EditRoute />;
      default:
        return null;
    }
  };

  const handleUserDelete = () => {
    Alert.alert('Aviso!', `Confirma que desea eliminar al usuario "${name}"`, [
      {
        text: 'Cancelar',
        onPress: () => {
          return;
        },
      },
      {
        text: 'Eliminar',
        onPress: async () => {
          const deleteOk = await deleteUser(_id);
          if (deleteOk) Alert.alert('Aviso!', 'Usuario eliminado!');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', height: 90}}>
          {img ? (
            <Image
              defaultSource={require('../assets/avatar.png')}
              source={{uri: img}}
              style={{width: 100, height: 100}}
            />
          ) : (
            <Image
              source={require('../assets/avatar.png')}
              style={{width: 100, height: 100}}
            />
          )}
          {deviceIdFailed && (
            <TouchableOpacity
              onPress={handleChangeDeviceId}
              style={{
                backgroundColor: '#F00',
                padding: 3,
                top: -5,
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Cambiar Disp.
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.name}>{name}</Text>
              <Icon
                name="trash-outline"
                color="#f00"
                size={20}
                onPress={handleUserDelete}
              />
            </View>
            <Text style={styles.id}>ID: {identification}</Text>
            <Text style={styles.role}>Cargo: {translateRoles(role)}</Text>
            <Text style={styles.state}>
              Estado: {isActive ? 'Activo' : 'Inactivo'}
            </Text>
            <Text style={styles.date}>
              Fecha de Creación: {createdDate.split('T')[0]}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1, marginTop: 5}}>
        <TabView
          style={{marginTop: 20}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              contentContainerStyle={{backgroundColor: '#e4e4e4', height: 38}}
              inactiveColor="#808080"
              activeColor="#f00"
              pressColor="#fff"
              {...props}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3a3a3a',
  },
  id: {
    fontSize: 12,
    color: '#3a3a3a',
  },
  deviceId: {
    fontSize: 10,
    color: '#3a3a3a',
  },
  role: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  state: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  date: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  menuItem: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F00',
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
