import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useUsers} from '../hooks/useUsers';
import {User} from '../interfaces/app-interfaces';
import {authStyles} from '../styles/authStyles';
import {translateRoles} from '../utils';

const SearchBar = ({users, setFilteredUsers}: any) => {
  const [word, setWord] = useState('');

  const onChangeWord = (word: string) => {      
    setWord(word);
    if (word.length) {
      const filteredUsers = users.filter(
        (user: User) => user.name.toLowerCase().includes(word.toLowerCase()) || user.identification.includes(word.toLowerCase()),
      );
      setFilteredUsers(filteredUsers);
    } else setFilteredUsers(users);
  };

  return (
    <View
      style={[
        authStyles.inputWrapper,
        {alignSelf: 'center', width: Dimensions.get('screen').width * 0.9},
      ]}>
      <Icon name="search" color="white" size={20} />
      <TextInput
        style={[authStyles.input, {fontSize: 15}]}
        onChangeText={onChangeWord}
        value={word}
        placeholder="busca por nombre o ID ..."
        placeholderTextColor="#ccc"
        keyboardType="default"
      />
    </View>
  );
};

const Item = (props: User) => {
  const {
    identification,
    name,
    role,
    img,
    isActive,
  } = props;

  const {navigate} = useNavigation();
  const onPressUser = () => navigate('UserDetail', {user: props});

  return (
    <TouchableOpacity style={styles.item} onPress={onPressUser}>
      <View
        style={[
          styles.imgWrapper,
          {borderColor: isActive ? '#00c060' : '#F00'},
        ]}>
        {img ? (
            <Image
              defaultSource={require('../assets/avatar.png')}
              source={{uri: img}}
              borderRadius={50}
              style={{width: 50, height: 50}}
            />
          ) : (
            <Image
              source={require('../assets/avatar.png')}
              style={{width: 50, height: 50}}
            />
          )}
      </View>
      <View style={styles.content}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.id}>ID {identification}</Text>
        <Text style={styles.role}>{translateRoles(role)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const UsersScreen = () => {
  const {users, filteredUsers, setFilteredUsers, setUsers, getAllUsers} = useUsers();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  
  const onRefresh = async () => {
    setIsRefreshing(true);
    await getAllUsers();
    setIsRefreshing(false);
  };

  return (
    <View style={{flex: 1, paddingBottom: 20}}>
      <SearchBar users={users} tempUsers={filteredUsers} setFilteredUsers={setFilteredUsers} setUsers={setUsers} />
      <FlatList
        keyExtractor={item => item._id}
        style={styles.list}
        data={filteredUsers}
        renderItem={({item}: any) => <Item {...item} />}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingBottom: 15,
  },
  item: {
    width: '95%',
    paddingHorizontal: 20,
    paddingVertical: 3,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignSelf: 'center',
  },
  imgWrapper: {
    borderWidth: 3,
    borderRadius: 50,
    padding: 3,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 30,
    color: '#3a3a3a',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3a3a3a',
  },
  id: {
    fontSize: 12,
    color: '#3a3a3a',
  },
  role: {
    fontSize: 14,
    alignSelf: 'flex-end',
    color: '#3a3a3a',
  },
});
