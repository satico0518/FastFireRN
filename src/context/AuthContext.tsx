import React, {createContext, useEffect, useReducer} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ffApi from '../api';
import {LoginData, LoginResponse, RegisterData, RegisterResponse, User} from '../interfaces/app-interfaces';
import {authReducer, AuthState} from './authReducer';

export const authInitState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: User | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  singUp: (registerData: RegisterData) => boolean;
  changePhoto: (uri: string) => void;
  singIn: (loginData: LoginData) => Promise<boolean>;
  logOut: () => void;
  removeError: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitState);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return dispatch({type: 'authFail'});
      const checkResponse = await ffApi.get('/auth/check');
      if (checkResponse.status !== 200){
        return dispatch({type: 'authFail'});
      }
      dispatch({
        type: 'signIn',
        payload: {
          token: checkResponse.data.token,
          user: checkResponse.data.user,
        }
      });
    };
    checkToken();
  }, [])
  

  const singUp = async ({identification, name, password, deviceId}: RegisterData):Promise<boolean> => {
    try {
      await ffApi.post<RegisterResponse>('/users', {
        identification,
        name,
        password,
		    deviceId,
      });
      return true;
    } catch (error: any) {
      Alert.alert('Aviso!', error.response.data.error.errors.map((e: any) => e.msg).join(', '));
      console.error(error.response.data);
      return false
    }
  };

  const singIn = async ({user, password, deviceId}: LoginData): Promise<boolean> => {
    try {             
      const response = await ffApi.post<LoginResponse>('/auth/login', {
        user,
        password,
		    deviceId,
      });
      
      if(response.status === 200) {
        dispatch({type: 'signIn', payload: response.data });
        
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('role', response.data.user.role);
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert('Aviso!', error.response.data.error, [{
        text: 'OK'
      }]);
      return false;    
    }
  };
  const changePhoto = async (uri: string) => {
    dispatch({type: 'changePhoto', payload: uri});
  };
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    dispatch({type: 'logOut'})
  };
  const removeError = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        singUp,
        singIn,
        changePhoto,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
