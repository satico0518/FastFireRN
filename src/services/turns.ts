import AsyncStorage from '@react-native-async-storage/async-storage';
import {AxiosResponse} from 'axios';
import ffApi from '../api';
import {Turn} from '../components/TurnItem';
import {Location} from '../hooks/useLocation';

export const getTurnsByUserAndDay = async (
  userID: string,
  day: string,
): Promise<Turn[] | any> => {
  try {
    const turnsApiResponse = await ffApi.get<Turn[]>(
      `/turns/${userID}?date=${day}`,
    );
    if (turnsApiResponse.status === 200) {
      return turnsApiResponse.data.sort((a, b) =>
        a.timeIn < b.timeIn ? -1 : b.timeIn < a.timeIn ? 1 : 0,
      );
    } else throw new Error('Error cargando turnos por usuario y fecha');
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveInTurn = async (userId: string, currentPosition: Location) => {
  try {
    const response = await ffApi.post('/turns', {
      user: userId,
      locationIn: {
        lat: currentPosition.lat.toString(),
        long: currentPosition.long.toString(),
      },
      timeIn: Date.now(),
    });
    if (response.status === 201) return response.data;
    else throw new Error('Error registrando ingreso');
  } catch (error: any) {
    console.error('Error saving in', {error: error.response.data.error});
    return {error: error.response.data.error.msg};
  }
};

export const saveOutTurn = async (currentPosition: Location) => {
  try {
    const currentTurnId = await AsyncStorage.getItem('currentTurnId');
    const response = await ffApi.put(`/turns/${currentTurnId}`, {
      timeOut: Date.now(),
      locationOut: {
        lat: currentPosition.lat,
        long: currentPosition.long,
      },
    });

    if (response.status === 200) return response.data;
    else throw new Error('Error registrando salida');
  } catch (error: any) {
    console.error('Error saving out', {error: error.response.data.error});
    return {error: error.response.data.error.msg};
  }
};

export const saveExtraHourReason = async (reason: string) => {
  try {
    const currentTurnId = await AsyncStorage.getItem('currentTurnId');
    const response = await ffApi.put(`/turns/${currentTurnId}/reason`, {reason});
    
    if (response.status === 200) return response.data;
    else throw new Error('Error registrando salida');
  } catch (error: any) {
    console.error('Error saving out', {error: error.response.data.error});
    return {error: error.response.data.error};
  }
};
