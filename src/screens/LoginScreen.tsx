import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';

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
    <ImageBackground
      style={{flex: 1}}
      source={require('../assets/background.png')}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.text}>Bienvenido!</Text>
          <Text style={styles.text2}>Ingresa para continuar</Text>
          <View style={styles.inputWrapper}>
            <Icon name="person-circle-outline" color="white" size={20} />
            <TextInput
              style={styles.input}
              onChangeText={val => handleInputChange(val, 'id')}
              value={form.id}
              placeholder="identificacion"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" color="white" size={20} />
            <TextInput
              inlineImageLeft=""
              style={styles.input}
              onChangeText={val => handleInputChange(val, 'password')}
              value={form.password}
              placeholder="contraseña"
              autoCapitalize="none"
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
          </TouchableOpacity>
          <View style={styles.linksWrapper}>
            <TouchableOpacity>
              <Text style={styles.smallLink}>recordar contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.smallLink}>registrarme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    width: Dimensions.get('screen').width * 0.8,
    height: 90,
  },
  text: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  text2: {
    fontSize: 13,
    color: 'white',
    marginBottom: 30,
  },
  inputWrapper: {
    width: Dimensions.get('screen').width * 0.8,
    backgroundColor: '#3d3d3dca',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
    paddingLeft: 30,
  },
  input: {
    width: '100%',
    color: 'white',
    fontSize: 20,
    marginLeft: 15,
  },
  loginButton: {
    width: Dimensions.get('screen').width * 0.8,
    backgroundColor: '#e93535',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  smallLink: {
    color: '#fff',
  },
});
