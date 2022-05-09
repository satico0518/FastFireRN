import {useContext, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Turn} from '../components/TurnItem';
import {AuthContext} from '../context/AuthContext';
import {Location} from './useLocation';
import {addDaysToDate, getLocaleFormatedDateString} from '../utils';
import {getTurnsByUserAndDay, saveInTurn, saveOutTurn} from '../services/turns';

export const useAssistance = () => {
  const {user} = useContext(AuthContext);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [currentDay, setCurrentDay] = useState<'Hoy' | 'Ayer'>('Hoy');
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isIn, setIsIn] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const getTurns = async (
    userID: string = user?._id as string,
    date: Date = new Date(),
  ) => {
    // Elimina data del storage por si se borra un turno iniciado de manera manual en la BD
    // AsyncStorage.removeItem('isIn');
    // AsyncStorage.removeItem('currentTurnId');
    try {
      setLoading(true);
      const day = getLocaleFormatedDateString(date);
      let [todayTurns, yTurns] = await Promise.all([
        getTurnsByUserAndDay(userID, day),
        getTurnsByUserAndDay(
          userID,
          getLocaleFormatedDateString(addDaysToDate(date, -1)),
        ),
      ]);
      if (currentDay === 'Hoy' && yTurns.length && !yTurns[yTurns.length - 1].timeOut) {
        Alert.alert('Aviso!', 'Tiene un turno por cerrar del dia anterior. Si se encuentra en una ubicación diferente solicite ayuda a su supervisor para cerrar el turno manualmente!');
        setCurrentDay('Ayer');
        return
      }
      if (currentDay === 'Ayer') todayTurns = yTurns;
      if (todayTurns.length > 0) {
        setTurns(todayTurns);
        if (todayTurns.length && !todayTurns[todayTurns.length - 1].timeOut) {
          setIsIn('true');
          AsyncStorage.setItem('isIn', 'true');
          AsyncStorage.setItem(
            'currentTurnId',
            todayTurns[todayTurns.length - 1]._id,
          );
        } else {
          setIsIn('false');
        }

        const totalHrs = todayTurns.reduce(
          (acum: number, turn: Turn) => acum + (turn.totalTimeMins as number),
          0,
        );
        setTotalHours(totalHrs * 60000);
      } else {
        setIsIn('false');
        AsyncStorage.setItem('isIn', 'false');
        setTurns([]);
        setTotalHours(0);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Aviso!', 'Error al cargar turnos!', [{text: 'Aceptar'}]);
    }
  };

  const saveIn = async (currentPosition: Location) => {
    try {
      setLoading(true);
      const turn = await saveInTurn(user?._id!, currentPosition);
      setTurns([
        ...turns,
        {
          timeIn: Date.now(),
          locationIn: currentPosition,
        },
      ]);
      AsyncStorage.setItem('isIn', 'true');
      setIsIn('true');
      AsyncStorage.setItem('currentTurnId', turn._id);
      getTurns();
    } catch (error: any) {
      setLoading(false);
      console.error('Error saving in', {error: error.response.data.error});
      Alert.alert('Aviso!', 'Error registrando ingreso');
      return {error: error.response.data.error.msg};
    }
  };

  const saveOut = async (currentPosition: Location) => {
    try {
      setLoading(true);
      const response = await saveOutTurn(currentPosition);
      if (response.error) {
        Alert.alert('Aviso!', response.error);
        setLoading(false);
        return;
      }

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
      setLoading(false);
      console.error(error);
      Alert.alert('Aviso!', error.response.data.error.msg);
    }
  };

  return {
    loading,
    turns,
    totalHours,
    isIn,
    currentDay,
    setCurrentDay,
    setIsIn,
    getTurns,
    saveIn,
    saveOut,
  };
};
