import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';
import { authStyles } from '../styles/authStyles';

interface Props extends NativeStackScreenProps<any, any> {}
interface Login {
  id: string;
  password: string;
}

export const LoginScreen = ({navigation}: Props) => {
  const [form, setForm] = useState<Login>({id: '', password: ''});
  const {authState, setAuthState} = useContext(AuthContext);

  const handleLogin = () => {
    setAuthState({
      ...authState,
      isLoggedIn: true,
    });
    navigation.replace('Assistance');
  };

  const handleInputChange = (value: string, field: 'id' | 'password') => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  return (
    <AuthScreenLayout>
      <View>
        <Text style={authStyles.text}>Bienvenido!</Text>
        <Text style={authStyles.text2}>Ingresa para continuar</Text>
        <View style={authStyles.inputWrapper}>
          <Icon name="person-circle-outline" color="white" size={20} />
          <TextInput
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'id')}
            value={form.id}
            placeholder="identificación"
            placeholderTextColor="#727272"
            keyboardType="numeric"
          />
        </View>
        <View style={authStyles.inputWrapper}>
          <Icon name="lock-closed-outline" color="white" size={20} />
          <TextInput
            inlineImageLeft=""
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'password')}
            value={form.password}
            placeholder="contraseña"
            placeholderTextColor="#727272"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={authStyles.loginButton} onPress={handleLogin}>
          <Text style={authStyles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>
        <View style={authStyles.linksWrapper}>
          <TouchableOpacity>
            <Text style={authStyles.smallLink}>recordar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={authStyles.smallLink}>registrarme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenLayout>
  );
};

