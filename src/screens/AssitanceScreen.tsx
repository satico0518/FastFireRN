import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import {useLocation} from '../hooks/useLocation';
import {useAssistance} from '../hooks/useAssistance';
import {isExtraHours} from '../utils';
import {saveExtraHourReason} from '../services/turns';

export const AssitanceScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [extraHoursReason, setExtraHoursReason] = useState('');
  const {permissions, askLocationPermissions} = useContext(PermissionContext);
  const {hasLocation, currentPosition, followUser, stopFollowUser} = useLocation();
  const {
    loading,
    turns,
    totalHours,
    isIn,
    currentDay,
    setCurrentDay,
    getTurns,
    saveIn,
    saveOut,
  } = useAssistance();

  const shouldCheckExtraHours = useRef(false);

  useEffect(() => {
    followUser();

    return () => {
      stopFollowUser();
    };
  }, []);

  useEffect(() => {
      getTurns();
  }, [currentDay]);

  useEffect(() => {
    if (
      shouldCheckExtraHours.current &&
      isExtraHours(totalHours) &&
      !turns[turns.length - 1].extraHourReason
    ) {
      setExtraHoursReason('');
      setModalVisible(true);
    }
  }, [totalHours]);

  const handleIn = async () => {
    const isLocEnable = await isLocationEnabled();
    if (!isLocEnable) {
      Alert.alert('Aviso!', 'Por favor active su GPS', [
        {
          text: 'OK',
          onPress: () => {
            return;
          },
        },
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
        onPress: () => saveIn(currentPosition),
      },
    ]);
  };

  const handleOut = async () => {
    const isLocEnable = await isLocationEnabled();
    if (!isLocEnable) {
      Alert.alert('Aviso!', 'Por favor active su GPS', [
        {
          text: 'OK',
          onPress: () => {
            return;
          },
        },
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
        onPress: async () => {
          setExtraHoursReason('');
          await saveOut(currentPosition);
          shouldCheckExtraHours.current = true;
        },
      },
    ]);
  };

  const onExtraHoursReasonChange = async () => {
    if (extraHoursReason.length < 10) {
      Alert.alert(
        'Aviso',
        'Complete su justificación, debe tener mas de 10 letras.',
        [
          {
            text: 'Ok',
            onPress: () => {
              return;
            },
          },
        ],
      );
      return;
    } else {
      setModalVisible(false);
      await saveExtraHourReason(extraHoursReason);
      setExtraHoursReason('');
      shouldCheckExtraHours.current = false;
      getTurns();
    }
  };

  return (
    <View style={styles.container}>
      {permissions.locationStatus === 'granted' ? (
        <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
          <Header />
          {hasLocation && !loading ? (
            <>
              <Map />
              {isIn === 'true' ? (
                <Fab
                  backColor="#fd5e13"
                  text="Registrar Salida"
                  onPress={handleOut}
                  disabled={loading}
                  style={styles.buttonOut}
                />
              ) : (
                <Fab
                  backColor="#00c060"
                  text="Registrar Ingreso"
                  onPress={handleIn}
                  disabled={currentDay === 'Ayer' || loading}
                  style={styles.buttonIn}
                />
              )}
              <Hr />
              <Text style={styles.registryTitle}>Registro de turnos</Text>
              <TurnsDateControl
                isLoading={loading}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
              />
              <TurnList turns={turns} totalHours={totalHours} />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirmación!</Text>
                    <Text style={styles.modalText}>
                      Por favor justifique por qué necesitó tiempo extra para
                      finalizar su turno.
                    </Text>
                    <TextInput
                      multiline
                      style={{
                        borderBottomColor: '#3a3a3a',
                        borderBottomWidth: 1,
                        marginBottom: 10,
                        width: '100%',
                        color: '#3a3a3a',
                      }}
                      onChangeText={setExtraHoursReason}
                      value={extraHoursReason}></TextInput>
                    <Pressable
                      style={[styles.modalButton, styles.buttonClose]}
                      onPress={onExtraHoursReasonChange}>
                      <Text style={styles.textStyle}>Enviar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Dimensions.get('screen').width * 0.9,
    justifyContent: 'center',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    width: '100%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#031c31',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#3a3a3a',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
    color: '#3a3a3a',
  },
});
