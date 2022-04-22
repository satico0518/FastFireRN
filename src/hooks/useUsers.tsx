import {useState} from 'react';
import {Alert} from 'react-native';
import ffApi from '../api';
import {User} from '../interfaces/app-interfaces';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const data = await ffApi.get<User[]>('/users');
      const sortedData = data.data.sort((a, b) =>
        a.createdDate > b.createdDate
          ? -1
          : b.createdDate > a.createdDate
          ? 1
          : 0,
      );
      setUsers(sortedData);
      setFilteredUsers(sortedData);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Aviso!', error.response.data.error, [{text: 'OK'}]);
    }
  };

  return {
    users,
    filteredUsers,
    setFilteredUsers,
    setUsers,
    getAllUsers,
  };
};
