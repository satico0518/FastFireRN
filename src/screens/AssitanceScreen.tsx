import React, {useContext, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  EmployeeAssistanceContext,
  EmployeeAssistanceState,
} from '../context/EmployeeAssistanceContext';
import {PermissionContext} from '../context/PermissionContext';
import MapView from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from './LoadingScreen';
import {Fab} from '../components/Fab';
import {Header} from '../components/Header';
import { Hr } from '../components/Hr';

export const AssitanceScreen = () => {
  const {permissions, askLocationPermissions} = useContext(PermissionContext);
  const {employeeAssistanceState, setEmployeeAssistanceState} = useContext(
    EmployeeAssistanceContext,
  );

  const {isIn} = employeeAssistanceState;
  const {hasLocation, initialPosition} = useLocation();

  useEffect(() => {
    console.log(employeeAssistanceState);
  }, [employeeAssistanceState]);

  const handleIn = () => {
    const newState: EmployeeAssistanceState = {
      isIn: true,
      inTime: new Date().toLocaleString(),
      location: 'work',
    };
    setEmployeeAssistanceState({...employeeAssistanceState, ...newState});
  };

  const handleOut = () => {
    const newState: EmployeeAssistanceState = {
      isIn: false,
      outTime: new Date().toLocaleString(),
      location: 'work',
    };
    setEmployeeAssistanceState({...employeeAssistanceState, ...newState});
  };

  return (
    <View style={styles.container}>
      {permissions.locationStatus === 'granted' ? (
        <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
          <Header />
          {hasLocation ? (
            <>
              <MapView
                style={{height: Dimensions.get('screen').height * 0.25}}
                initialRegion={{
                  latitude: initialPosition.lat,
                  longitude: initialPosition.long,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation
                followsUserLocation
              />
              {isIn ? (
                <Fab
                  iconName="log-out-outline"
                  backColor="orange"
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
            </>
          ) : (
            <LoadingScreen />
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>
            Por favor permita el acceso a su ubicacion!
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
    height: 50,
    marginVertical: 20,
    alignSelf: 'center',
  },
});
