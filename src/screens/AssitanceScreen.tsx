import React, {useContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  EmployeeAssistanceContext,
  EmployeeAssistanceState,
} from '../context/EmployeeAssistanceContext';
import {PermissionContext} from '../context/PermissionContext';
import MapView from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from './LoadingScreen';

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
          {hasLocation ? (
            <MapView
              style={{flex: 1}}
              initialRegion={{
                latitude: initialPosition.lat,
                longitude: initialPosition.long,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation
              followsUserLocation
            />
          ) : (
            <LoadingScreen />
          )}
          {isIn ? (
            <TouchableOpacity
              style={styles.actionButtonOut}
              onPress={handleOut}>
              <Text style={styles.actionButtonText}>Registrar Salida</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButtonIn} onPress={handleIn}>
              <Text style={styles.actionButtonText}>Registrar Ingreso</Text>
            </TouchableOpacity>
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
  actionButtonIn: {
    backgroundColor: 'green',
  },
  actionButtonOut: {
    backgroundColor: 'orange',
  },
  actionButtonText: {
    color: 'white',
    width: '100%',
  },
});
