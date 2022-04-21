import {useContext, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Turn} from '../components/TurnItem';
import {AuthContext} from '../context/AuthContext';
import {useLocation} from './useLocation';
import ffApi from '../api';

export const useAssistance = () => {
  const {user} = useContext(AuthContext);
  const {currentPosition, getCurrentLocation} = useLocation();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isIn, setIsIn] = useState<string>();

  const getTurns = async (date: Date) => {
    try {
      const day = date.toISOString().split('T')[0];
      const turnsApi = await ffApi.get(`/turns/${user?._id}?date=${day}`);
      if (turnsApi.data.length > 0) {
        setTurns(turnsApi.data);
        setIsIn(((await AsyncStorage.getItem('isIn')) as string) || 'false');
        const totalHrs = turnsApi.data.reduce(
          (acum: number, turn: Turn) => acum + (turn.totalTimeMins as number),
          0,
        );
        setTotalHours(totalHrs * 60000);
      }
    } catch (error) {
      Alert.alert('Aviso!', 'Error al cargar turnos!', [{text: 'Aceptar'}]);
    }
  };

  const saveIn = async () => {
    try {
      const turn = await ffApi.post('/turns', {
        user: user?._id,
        locationIn: {
          lat: currentPosition.lat.toString(),
          long: currentPosition.long.toString(),
        },
        timeIn: Date.now(),
      });
      getCurrentLocation();
      setTurns([
        ...turns,
        {
          timeIn: Date.now(),
          locationIn: currentPosition,
        },
      ]);
      AsyncStorage.setItem('isIn', 'true');
      setIsIn('true');
      AsyncStorage.setItem('currentTurnId', turn.data._id);
      getTurns();
    } catch (error: any) {
      console.log(error);
      Alert.alert('Aviso!', error.response.data.error.msg);
    }
  };

  const saveOut = async () => {
    try {
      await ffApi.put(`/turns/${await AsyncStorage.getItem('currentTurnId')}`, {
        timeOut: Date.now(),
        locationOut: {
          lat: currentPosition.lat,
          long: currentPosition.long,
        },
      });
      const index = turns.findIndex((h: Turn) => !h.timeOut);
      getCurrentLocation();
      setTurns([
        ...turns.slice(0, index),
        {
          ...turns[index],
          timeOut: Date.now(),
          locationOut: currentPosition,
        },
        ...turns.slice(index + 1),
      ]);
      AsyncStorage.setItem('isIn', 'false');
      setIsIn('false');
      getTurns();
    } catch (error: any) {
      console.log(error);
      Alert.alert('Aviso!', error.response.data.error.msg);
    }
  };

  return {
    turns,
    totalHours,
    isIn,
    getTurns,
    saveIn,
    saveOut,
  };
};
