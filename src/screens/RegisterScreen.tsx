import React, {useContext, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';
import {authStyles} from '../styles/authStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContext} from '../context/AuthContext';
import {syncUniqueId} from 'react-native-device-info';
import {RegisterData} from '../interfaces/app-interfaces';

interface Props extends NativeStackScreenProps<any, any> {}
interface Register {
  id: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

export const RegisterScreen = ({navigation}: Props) => {
  const {singUp} = useContext(AuthContext);
  const [form, setForm] = useState<Register>({
    id: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });

  const handleInputChange = (
    value: string,
    field: 'id' | 'name' | 'password' | 'passwordConfirm',
  ) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    if (
      form.id.length < 3 ||
      form.name.length < 3 ||
      form.password.length < 6
    ) {
      Alert.alert(
        'Aviso',
        'Identificación (min 3 letras), Nombre (minimo 3 letras) y Contraseña (min 6 letras) son obligatorios',
        [
          {
            text: 'Ok',
          },
        ],
        {
          onDismiss: () => {
            return;
          },
        },
      );
      return;
    }
    if (form.password !== form.passwordConfirm) {
      Alert.alert(
        'Alerta',
        'Las contrasenas no coinciden, revise por favor!',
        [{text: 'OK'}],
        {
          cancelable: true,
          onDismiss: () => {
            return;
          },
        },
      );
      return;
    }
    const deviceId = await syncUniqueId();
    const registerData: RegisterData = {
      identification: form.id,
      name: form.name,
      password: form.passwordConfirm,
      deviceId,
    };
    singUp(registerData);
    Alert.alert(
      'Aviso',
      'Registro existoso! Por favor solicite su activación con su supervisor.',
      [{text: 'Ok', onPress: () => navigation.replace('Login')}],
      {onDismiss: () => navigation.replace('Login')},
    );
  };
  return (
    <AuthScreenLayout>
      <View>
        <Text style={authStyles.text}>Bienvenido!</Text>
        <Text style={authStyles.text2}>Registrate para continuar</Text>
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
          <Icon name="person-outline" color="white" size={20} />
          <TextInput
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'name')}
            value={form.name}
            placeholder="nombre"
            placeholderTextColor="#ccc"
            autoCapitalize="words"
            autoCorrect={false}
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
            secureTextEntry
          />
        </View>
        <View style={authStyles.inputWrapper}>
          <Icon name="lock-closed-outline" color="white" size={20} />
          <TextInput
            inlineImageLeft=""
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'passwordConfirm')}
            value={form.passwordConfirm}
            placeholder="confirmar contraseña"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={authStyles.loginButton}
          onPress={handleRegister}>
          <Text style={authStyles.loginButtonText}>Listo</Text>
        </TouchableOpacity>
        <View style={{...authStyles.linksWrapper, alignSelf: 'flex-end'}}>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={authStyles.smallLink}>ya tengo un usuario</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenLayout>
  );
};
