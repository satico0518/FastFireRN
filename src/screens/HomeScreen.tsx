import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';

export const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  return (
    <AuthScreenLayout>
      <View style={{justifyContent: 'space-around'}}>
        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#3a3a3a'}}>Hola,</Text>
          <Text style={{fontSize: 30, color: '#3a3a3a'}}>{user?.name}</Text>
        </View>
        <Text style={{fontSize: 20, marginTop: 30, color: '#3a3a3a'}}>Fast Fire de Colombia 2022</Text>
      </View>
    </AuthScreenLayout>
  );
};
