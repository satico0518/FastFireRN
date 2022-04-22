import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../interfaces/app-interfaces';
import {translateRoles} from '../utils';

export const UserDetailScreen = ({route}: any) => {
  const {identification, name, role, createdDate, isActive, img}: User =
    route.params.user;

  const menu = [
    {id: 1, name: 'Turnos', icon: 'construct'},
    {id: 2, name: 'Nomina', icon: 'analytics'},
    {id: 3, name: 'RRHH', icon: 'accessibility'},
    {id: 4, name: 'Certificados', icon: 'newspaper'},
    {id: 5, name: 'Asignar Obra', icon: 'pin'},
    {id: 6, name: 'Editar', icon: 'create'},
  ];

  const renderMenu = ({item}: any) => (
    <TouchableOpacity style={styles.menuItem}>
      <Icon name={item.icon} size={25} style={{}} color="#fff" />
      <Text style={{color: '#fff', fontSize: 18, fontWeight: '600'}}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <View>
          {img ? (
            <Image
              defaultSource={require('../assets/avatar.png')}
              source={{uri: img}}
              borderRadius={50}
              style={{width: 100, height: 100}}
            />
          ) : (
            <Image
              source={require('../assets/avatar.png')}
              style={{width: 100, height: 100}}
            />
          )}
        </View>
        <View style={styles.content}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.id}>ID {identification}</Text>
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
      <View style={{marginVertical: 30}}>
        <FlatList data={menu} renderItem={renderMenu} horizontal />
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
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 12,
  },
  role: {
    fontSize: 14,
  },
  state: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
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
