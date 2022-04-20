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
import {
  EmployeeAssistanceContext,
  EmployeeAssistanceState,
} from '../context/EmployeeAssistanceContext';
import {PermissionContext} from '../context/PermissionContext';
import MapView, {Marker} from 'react-native-maps';
import {Location, useLocation} from '../hooks/useLocation';
import {LoadingScreen} from './LoadingScreen';
import {Fab} from '../components/Fab';
import {Header} from '../components/Header';
import {Hr} from '../components/Hr';
import Icon from 'react-native-vector-icons/Ionicons';
import {convertMsToHM} from '../utils';
import {History, HistoryItem} from '../components/HistoryItem';

export const AssitanceScreen = () => {
  const {permissions, askLocationPermissions} = useContext(PermissionContext);
  const {employeeAssistanceState, setEmployeeAssistanceState} = useContext(
    EmployeeAssistanceContext,
  );

  const {isIn} = employeeAssistanceState;
  const {hasLocation, currentPosition, getCurrentLocation} = useLocation();
  const [history, setHistory] = useState<History[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);

  useEffect(() => {
    if (history.length > 0) {
      let acum = 0;
      history.forEach(h => {
        if (h.endTime) {
          acum += Math.floor(h.endTime - h.initTime);
        }
      });
      setTotalHours(acum);
    }
  }, [history]);

  const handleIn = () => {
    Alert.alert('Aviso', 'Registrar inicio de turno?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'SI',
        onPress: () => {
          const newState: EmployeeAssistanceState = {
            isIn: true,
            inTime: new Date().toLocaleString(),
            location: 'work',
          };
          getCurrentLocation();
          setHistory([
            ...history,
            {
              initTime: new Date().getTime(),
              initLocation: currentPosition,
            },
          ]);
          setEmployeeAssistanceState({...employeeAssistanceState, ...newState});
        },
      },
    ]);
  };

  const handleOut = () => {
    Alert.alert('Aviso!', 'Registrar fin de turno?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'SI',
        onPress: () => {
          const newState: EmployeeAssistanceState = {
            isIn: false,
            outTime: new Date().toLocaleString(),
            location: 'work',
          };
          const index = history.findIndex(h => !h.endTime);
          getCurrentLocation();
          setHistory([
            ...history.slice(0, index),
            {
              ...history[index],
              endTime: new Date().getTime(),
              endLocation: currentPosition,
            },
            ...history.slice(index + 1),
          ]);
          setEmployeeAssistanceState({...employeeAssistanceState, ...newState});
        },
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
              <MapView
                showsUserLocation
                followsUserLocation
                userInterfaceStyle="dark"
                style={{height: Dimensions.get('screen').height * 0.2}}
                initialRegion={{
                  latitude: currentPosition.lat,
                  longitude: currentPosition.long,
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.009,
                }}>
                <Marker
                  coordinate={{
                    latitude: currentPosition.lat,
                    longitude: currentPosition.long,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.3,
                  }}
                  title="Usted está aquí"
                  description="En este punto se guardará su registro"
                  image={require('../assets/pin.png')}
                />
              </MapView>
              {isIn ? (
                <Fab
                  iconName="log-out-outline"
                  backColor="#fd5e13"
                  text="Registrar Salida"
                  onPress={handleOut}
                  style={styles.actionButton}
                />
              ) : (
                <Fab
                  iconName="hammer-outline"
                  backColor="#00c060"
                  text="Registrar Ingreso"
                  onPress={handleIn}
                  style={styles.actionButton}
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
                <TouchableOpacity
                  style={styles.arrows}>
                  <Icon name="arrow-back-sharp" size={20} />
                </TouchableOpacity>
                <Text style={{fontWeight: 'bold'}}>Hoy</Text>
                <TouchableOpacity
                  style={styles.arrows}>
                  <Icon name="arrow-forward-sharp" size={20} />
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
                <View style={{height: Dimensions.get('screen').height * 0.2}}>
                  <ScrollView>
                    {history.map(h => (
                      <HistoryItem key={h.initTime} {...h} />
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
  actionButton: {
    width: Dimensions.get('screen').width * 0.9,
    height: 30,
    marginVertical: 10,
    alignSelf: 'center',
  },
  arrows: {
    borderColor: '#555555',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
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
