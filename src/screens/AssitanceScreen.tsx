import React, {useContext, useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {isLocationEnabled} from 'react-native-device-info';
import {LoadingScreen} from './LoadingScreen';
import {Fab} from '../components/Fab';
import {Header} from '../components/Header';
import {Hr} from '../components/Hr';
import {Map} from '../components/Map';
import {PermissionContext} from '../context/PermissionContext';
import {TurnList} from '../components/TurnList';
import {TurnsDateControl} from '../components/TurnsDateControl';
import {Location, useLocation} from '../hooks/useLocation';
import {useAssistance} from '../hooks/useAssistance';

export const AssitanceScreen = () => {
  const [queryDate, setQueryDate] = useState(new Date());
  const [currentDay, setCurrentDay] = useState<'Hoy' | 'Ayer'>('Hoy');
  const {permissions, askLocationPermissions} = useContext(PermissionContext);
  const {hasLocation, currentPosition, followUser, stopFollowUser} = useLocation();
  const {turns, totalHours, isIn, getTurns, saveIn, saveOut} = useAssistance();
  const [location, setLocation] = useState<Location>({lat: 0, long: 0})

  useEffect(() => {
    setLocation(currentPosition);
  }, [currentPosition]);
  
  useEffect(() => {
    followUser();

    return () => {stopFollowUser()};
  }, []);

  useEffect(() => {
    getTurns(undefined, queryDate);
  }, []);

  const handleIn = async () => {
    const isLocEnable = await isLocationEnabled();
    if (!isLocEnable) {
      Alert.alert('Aviso!', 'Por favor active su GPS', [
        {text: 'OK', onPress: () => {return}}        
      ]);
      return;
    }
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
        onPress: () => saveIn(location),
      },
    ]);
  };

  const handleOut = async () => {
    const isLocEnable = await isLocationEnabled();
    if (!isLocEnable) {
      Alert.alert('Aviso!', 'Por favor active su GPS', [
        {text: 'OK', onPress: () => {return}}        
      ]);
      return;
    }
    Alert.alert('Aviso!', 'Registrar fin de turno?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'SI',
        onPress: () => saveOut(location),
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
              <Map />
              {isIn === 'true' && currentDay === 'Hoy' ? (
                <Fab
                  backColor="#fd5e13"
                  text="Registrar Salida"
                  onPress={handleOut}
                  style={styles.buttonOut}
                />
              ) : (
                currentDay === 'Hoy' && (
                  <Fab
                    backColor="#00c060"
                    text="Registrar Ingreso"
                    onPress={handleIn}
                    style={styles.buttonIn}
                  />
                )
              )}
              <Hr />
              <Text style={styles.registryTitle}>Registro de turnos</Text>
              <TurnsDateControl
                getTurns={getTurns}
                queryDate={queryDate}
                setQueryDate={setQueryDate}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
              />
              <TurnList turns={turns} totalHours={totalHours} />
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
  registryTitle: {
    top: 10,
    fontSize: 15,
    color: '#3a3a3a',
    alignSelf: 'center',
  },
});
