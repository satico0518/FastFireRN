import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthScreenLayout} from '../layouts/AuthScreenLayout';
import {authStyles} from '../styles/authStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface Props extends NativeStackScreenProps<any, any> {}
interface Register {
  id: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

export const RegisterScreen = ({navigation}: Props) => {
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

  const handleRegister = () => {
    // TODO register user
    navigation.replace('Assistance');
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
            placeholderTextColor="#727272"
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
            placeholderTextColor="#727272"
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
        <View style={authStyles.inputWrapper}>
          <Icon name="lock-closed-outline" color="white" size={20} />
          <TextInput
            inlineImageLeft=""
            style={authStyles.input}
            onChangeText={val => handleInputChange(val, 'passwordConfirm')}
            value={form.passwordConfirm}
            placeholder="confirmar contraseña"
            placeholderTextColor="#727272"
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
