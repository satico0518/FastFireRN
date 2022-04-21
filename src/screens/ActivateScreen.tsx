import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ffApi from '../api';
import {Fab} from '../components/Fab';
import {Role, User} from '../interfaces/app-interfaces';
import {translateRoles} from '../utils';

const Item = ({_id, identification, name, role, setUsers}: any) => {
  const activateUser = (
    _id: string,
    name: string,
    role: Role = 'USER_ROLE',
  ) => {
    Alert.alert(
      'Aviso!',
      `Confirma activación de ${name} como ${translateRoles(role)}?`,
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            await ffApi.put(`/users/${_id}`, {
              isActive: true,
              role,
            });
            setUsers((users: User[]) => {
              return users.filter(u => u._id !== _id);
            });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.item}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imgWrapper}>
          <Image
            source={require('../assets/avatar.png')}
            style={{width: 50, height: 50}}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.title}>CC {identification}</Text>
          <Text style={styles.title}>{translateRoles(role)}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Fab
          text="Operario"
          backColor="#00c060"
          onPress={() => activateUser(_id, name)}
          style={styles.button}
        />
        <Fab
          text="Supervisor"
          backColor="#f87822"
          onPress={() => activateUser(_id, name, 'SUPERVISOR_ROLE')}
          style={styles.button}
        />
        <Fab
          text="Admin"
          backColor="#c00d00"
          onPress={() => activateUser(_id, name, 'ADMIN_ROLE')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const renderItem = ({item}: any, setUsers: any) => (
  <Item
    _id={item._id}
    identification={item.identification}
    name={item.name}
    role={item.role}
    setUsers={setUsers}
  />
);

export const ActivateScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const getInactiveUsers = async () => {
    try {
      const data = await ffApi.get<User[]>('/users/inactive');
      setUsers(data.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Aviso!', error.response.data.error, [{text: 'OK'}]);
    }
  };
  useEffect(() => {
    getInactiveUsers();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getInactiveUsers();
    setIsRefreshing(false);
  };

  return (
    <View style={{flex: 1}}>
      {users.length ? (
        <FlatList
          data={users}
          renderItem={item => renderItem(item, setUsers)}
          keyExtractor={item => item._id}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text style={{fontSize: 18}}>
            No hay usuarios pendientes por activación
          </Text>
          <Fab
            text="Verificar"
            onPress={getInactiveUsers}
            backColor="#F00"
            style={{height: 50, marginTop: 20}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  imgWrapper: {
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 50,
    padding: 3,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginLeft: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 20,
    color: '#3b3b3b',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 12,
    color: '#5a5a5a',
  },
  button: {
    width: 100,
    height: 30,
    marginVertical: 10,
  },
});
