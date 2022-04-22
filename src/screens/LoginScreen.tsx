import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useState} from 'react';
import {Text, TextInput, View, TouchableOpacity, Alert} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';
import {LoginData} from '../interfaces/app-interfaces';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';
import {authStyles} from '../styles/authStyles';

interface Props extends NativeStackScreenProps<any, any> {}
interface Login {
  id: string;
  password: string;
}

export const LoginScreen = ({navigation}: Props) => {
  const [passVisible, setPassVisible] = useState<boolean>(false);
  const [form, setForm] = useState<Login>({id: '79958852', password: '123456'});
  const {singIn} = useContext(AuthContext);

  const handleLogin = async () => {
    if (form.id.length < 3 || form.password.length < 6) {
      Alert.alert('Aviso', 'Identificación (min 3 letras) y Contraseña (min 6 letras) son obligatorios', [{
        text: 'Ok'
      }], {
        onDismiss: () => {
          return;
        },
      });
      return;
    }
    const loginData: LoginData = {
      user: form.id,
      password: form.password,
      deviceId: getUniqueId(),
    };
    try {
      const success = await singIn(loginData);
      const role = (await AsyncStorage.getItem('role')) || 'USER_ROLE';

      if (success) {
        if (role === 'ADMIN_ROLE') {
          navigation.replace('Activate');
        } else {
          navigation.replace('Assistance');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (value: string, field: 'id' | 'password') =>
    setForm({...form, [field]: value});

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
            placeholderTextColor="#ccc"
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
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            secureTextEntry={!passVisible}
          />
          <Icon
            style={{position: 'absolute', right: 20}}
            name={passVisible ? 'eye-off' : 'eye'}
            color="white"
            size={20}
            onPress={() => setPassVisible(!passVisible)}
          />
        </View>
        <TouchableOpacity style={authStyles.loginButton} onPress={handleLogin}>
          <Text style={authStyles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>
        <View style={authStyles.linksWrapper}>
          <TouchableOpacity>
            <Text style={authStyles.smallLink}>cambiar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={authStyles.smallLink}>registrarme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenLayout>
  );
};
