import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LoadingScreen} from './LoadingScreen';
import {Fab} from '../components/Fab';
import {Header} from '../components/Header';
import {Hr} from '../components/Hr';
import {Turn, TurnItem} from '../components/TurnItem';
import {Map} from '../components/Map';
import {AuthContext} from '../context/AuthContext';
import {PermissionContext} from '../context/PermissionContext';
import {useLocation} from '../hooks/useLocation';
import {convertMsToHM} from '../utils';
import ffApi from '../api';

export const AssitanceScreen = () => {
  const {user} = useContext(AuthContext);
  const {permissions, askLocationPermissions} = useContext(PermissionContext);
  const {hasLocation, currentPosition, getCurrentLocation} = useLocation();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isIn, setIsIn] = useState<string>();
  const [currentDay, setCurrentDay] = useState<string>('Hoy');

  useEffect(() => {
    getTurns();
  }, []);

  const getTurns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const turnsApi = await ffApi.get(`/turns/${user?._id}?date=${today}`);
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
      const index = turns.findIndex(h => !h.timeOut);
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

  const handleIn = () => {
    Alert.alert('Aviso', 'Registrar inicio de turno?', [
      {
        text: 'Cancel',
        onPress: () => {
          return;
        },
        style: 'cancel',
      },
      {
        text: 'SI',
        onPress: saveIn,
      },
    ]);
  };

  const handleOut = () => {
    Alert.alert('Aviso!', 'Registrar fin de turno?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'SI',
        onPress: saveOut,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {permissions.locationStatus === 'granted' ? (
        <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
          <Header />
          {hasLocation ? (
            <>
              <Map currentPosition={currentPosition} />
              {isIn === 'true' ? (
                <Fab
                  backColor="#fd5e13"
                  text="Registrar Salida"
                  onPress={handleOut}
                  style={styles.buttonOut}
                />
              ) : (
                <Fab
                  backColor="#00c060"
                  text="Registrar Ingreso"
                  onPress={handleIn}
                  style={styles.buttonIn}
                />
              )}
              <Hr />
              <Text style={styles.registryTitle}>Registro de turnos</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20,
                  width: Dimensions.get('screen').width * 0.7,
                  alignSelf: 'center',
                }}>
                <TouchableOpacity style={styles.arrows}>
                  <Icon name="arrow-back" size={20} />
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  {currentDay}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.arrows,
                    currentDay === 'Hoy' ? styles.disabledArrow : null,
                  ]}
                  disabled={currentDay === 'Hoy'}>
                  {currentDay !== 'Hoy' ? <Icon name="arrow-forward" size={20} /> : <Text />}
                </TouchableOpacity>
              </View>
              <View style={styles.registryContent}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Tiempo acumulado
                  </Text>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {convertMsToHM(totalHours)} hrs
                  </Text>
                </View>
                <View
                  style={{
                    height: Dimensions.get('screen').height * 0.2,
                    marginTop: 10,
                  }}>
                  <ScrollView>
                    {turns.map(h => (
                      <TurnItem key={h.timeIn} {...h} />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </>
          ) : (
            <LoadingScreen />
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>
            Por favor permita el acceso a su ubicación!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={askLocationPermissions}>
            <Text style={styles.buttonText}>Permitir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  text: {
    width: '50%',
    color: 'white',
    fontSize: 20,
    marginBottom: 30,
  },
  button: {
    height: 50,
    width: 130,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonIn: {
    width: Dimensions.get('screen').width * 0.5,
    height: 30,
    marginVertical: 10,
    paddingLeft: 20,
  },
  buttonOut: {
    width: Dimensions.get('screen').width * 0.5,
    height: 30,
    marginVertical: 10,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  arrows: {
    borderColor: '#555555',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
  },
  disabledArrow: {
    borderWidth: 0,
  },
  registryTitle: {
    top: 10,
    fontSize: 15,
    alignSelf: 'center',
  },
  registryContent: {
    backgroundColor: '#f3f3f3',
    margin: 20,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
