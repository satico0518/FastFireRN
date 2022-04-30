import {useContext, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Turn} from '../components/TurnItem';
import {AuthContext} from '../context/AuthContext';
import {Location, useLocation} from './useLocation';
import ffApi from '../api';

export const useAssistance = () => {
  const {user} = useContext(AuthContext);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isIn, setIsIn] = useState<string>();
  const {getCurrentLocation} = useLocation();

  const getTurns = async (userID: string = user?._id as string, date: Date = new Date()) => {
    // Elimina data del storage por si se borra un turno iniciado de manera manual en la BD
    // AsyncStorage.removeItem('isIn');
    // AsyncStorage.removeItem('currentTurnId');
    try {
      getCurrentLocation();
      const day = date.toISOString().split('T')[0];
      const turnsApi = await ffApi.get(`/turns/${userID}?date=${day}`);
      if (turnsApi.data.length > 0) {
        setTurns(turnsApi.data);
        if (turnsApi.data.length && !turnsApi.data[turnsApi.data.length - 1].timeOut) {
          setIsIn('true');
          AsyncStorage.setItem('isIn', 'true');
          AsyncStorage.setItem('currentTurnId', turnsApi.data[turnsApi.data.length - 1]._id);
        } else {
          setIsIn(((await AsyncStorage.getItem('isIn')) as string) || 'false');
        }
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

  const saveIn = async (currentPosition: Location) => {
    try {
      const turn = await ffApi.post('/turns', {
        user: user?._id,
        locationIn: {
          lat: currentPosition.lat.toString(),
          long: currentPosition.long.toString(),
        },
        timeIn: Date.now(),
      });
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

  const saveOut = async (currentPosition: Location) => {
    try {
      await ffApi.put(`/turns/${await AsyncStorage.getItem('currentTurnId')}`, {
        timeOut: Date.now(),
        locationOut: {
          lat: currentPosition.lat,
          long: currentPosition.long,
        },
      });
      const index = turns.findIndex((h: Turn) => !h.timeOut);
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
    setIsIn,
    getTurns,
    saveIn,
    saveOut,
  };
};
