import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';
import {authStyles} from '../styles/authStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {syncUniqueId} from 'react-native-device-info';
import ffApi from '../api';

interface Props extends NativeStackScreenProps<any, any> {}
interface ChangePassword {
  identification: string;
  password: string;
  passwordConfirm?: string;
  deviceId: string;
}

export const ChangePasswordScreen = ({navigation}: Props) => {
  const [form, setForm] = useState<ChangePassword>({
    identification: '',
    password: '',
    passwordConfirm: '',
    deviceId: '',
  });

  const handleInputChange = (
    value: string,
    field: 'identification' | 'password' | 'passwordConfirm',
  ) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    if (form.identification.length < 3 || form.password.length < 6) {
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
    const changePasswordData: ChangePassword = {
      identification: form.identification,
      password: form.passwordConfirm,
      deviceId,
    };
    try {
      await ffApi.put('/auth/password', changePasswordData);
      Alert.alert(
        'Aviso',
        'Cambio existoso! Ya puede ingresar.',
        [{text: 'Ok', onPress: () => navigation.replace('Login')}],
        {onDismiss: () => navigation.replace('Login')},
      );
    } catch (error: any) {
      console.error('Error saving in', {error: error.response.data.error});
      Alert.alert('Aviso!', error.response.data.error.msg || 'Error cambiando contraseña!', [
        { text: 'Ok', onPress: () => { return; }},
      ]);
      return {error: error.response.data.error.msg};
    }
  };
  return (
    <AuthScreenLayout>
      <View>
        <Text style={authStyles.text}>Bienvenido!</Text>
        <Text style={authStyles.text2}>Cambia tu contraseña</Text>
        <View style={authStyles.inputWrapper}>
          <Icon name="person-circle-outline" color="white" size={20} />
          <TextInput
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'identification')}
            value={form.identification}
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
          <Text style={authStyles.loginButtonText}>Cambiar</Text>
        </TouchableOpacity>
        <View style={{...authStyles.linksWrapper, alignSelf: 'flex-end'}}>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={authStyles.smallLink}>ya recordé mi contraseña</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenLayout>
  );
};
