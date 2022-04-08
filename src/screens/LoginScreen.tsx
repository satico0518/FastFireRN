import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

interface Props extends NativeStackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {authState, setAuthState} = useContext(AuthContext);

  const handleLogin = () => {
    setAuthState({
      ...authState,
      isLoggedIn: true
    })
    navigation.replace('Assistance')
  }

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../assets/background.png')}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenido!</Text>
        <Text style={styles.text2}>Ingresa para continuar</Text>
        <View style={styles.inputWrapper}>
          <Icon name="person-circle-outline" color="white" size={20} />
          <TextInput
            style={styles.input}
            onChangeText={() => {}}
            value="79958852"
            placeholder="identificacion"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="lock-closed-outline" color="white" size={20} />
          <TextInput
            inlineImageLeft=""
            style={styles.input}
            onChangeText={() => {}}
            value="**********"
            placeholder="contraseña"
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    bottom: 100,
  },
  logo: {
    width: Dimensions.get('screen').width * 0.8,
    height: 90,
    position: 'relative',
    top: 150,
    alignSelf: 'center'
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
});
