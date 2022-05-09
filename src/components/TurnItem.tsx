import React, {useContext, useState} from 'react';
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
import {Location} from '../hooks/useLocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {convertMsToHM, getLocaleTimeFromDateNumber} from '../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AuthContext} from '../context/AuthContext';
import {saveManualOutTurn} from '../services/turns';
import {Calendar, DateData} from 'react-native-calendars';

export interface Turn {
  _id?: string;
  timeIn: number;
  locationIn: Location;
  timeOut?: number;
  locationOut?: Location;
  totalTimeMins?: number;
  extraHourReason?: string;
  isManualFinished?: boolean;
}

export const TurnItem = ({turn}: {turn: Turn}) => {
  const [manualHour, setManualHour] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateData | null>(null);
  const {user} = useContext(AuthContext);
  const handleCheckReason = () =>
    Alert.alert('Justificación', turn.extraHourReason);

  const handleManualExit = () => {
    Alert.alert('Aviso!', 'Confirma terminar el turno manualmente?', [
      {text: 'Cancelar'},
      {
        text: 'Terminar',
        onPress: async () => setModalVisible(true),
      },
    ]);
  };
  return (
    <View style={styles.itemWrapper}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.textIn}>
          {getLocaleTimeFromDateNumber(turn.timeIn)}
        </Text>
        <Icon
          color="#3a3a3a"
          name="arrow-forward-outline"
          size={20}
          style={{marginHorizontal: 7}}
        />
        <Text style={styles.textOut}>
          {turn.timeOut
            ? getLocaleTimeFromDateNumber(turn.timeOut as number)
            : '...'}
        </Text>
        {turn.extraHourReason && (
          <TouchableOpacity onPress={handleCheckReason}>
            <Icon
              style={{marginLeft: 5}}
              name="chatbox-ellipses-outline"
              color="#3a3a3a"
              size={18}
            />
          </TouchableOpacity>
        )}
        {turn.isManualFinished && user?.role === 'ADMIN_ROLE' && (
          <Text style={{marginLeft: 5, fontWeight: 'bold', color: '#f00', fontSize: 11, alignSelf: 'flex-end'}}>manual</Text>
        )}
        {!turn.timeOut && user?.role === 'ADMIN_ROLE' && (
          <TouchableOpacity onPress={handleManualExit}>
            <Icon
              style={{marginLeft: 25}}
              name="exit-outline"
              color="#ff0000"
              size={18}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={{color: '#3a3a3a'}}>
          {convertMsToHM(((turn.totalTimeMins || 0) as number) * 60000)} hrs
        </Text>
      </View>
      {modalVisible && (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Hora de Finalización!</Text>
              <Text style={styles.modalText}>
                Seleccione la fecha e ingrese la hora de finalización del turno.
              </Text>
              <Calendar
                minDate={'2022-04-27'}
                maxDate={new Date().toISOString().split('T')[0]}
                onDayPress={setSelectedDate}
                monthFormat={'MMMM yyyy'}
                firstDay={1}
                disableAllTouchEventsForDisabledDays={true}
                theme={{
                  arrowColor: '#f00',
                  todayTextColor: '#f00',
                }}
              />
              <Text style={{color: '#3a3a3a'}}>Fecha seleccionada:</Text>
              <Text style={{fontWeight: 'bold', color: '#3a3a3a'}}>
                {selectedDate?.dateString}
              </Text>
              <TextInput
                style={{
                  borderBottomColor: '#3a3a3a',
                  borderBottomWidth: 1,
                  marginBottom: 10,
                  width: 100,
                  color: '#3a3a3a',
                  textAlign: 'center',
                }}
                placeholder="Ej. 02:05"
                onChangeText={setManualHour}
                value={manualHour}></TextInput>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={async () => {
                  if (
                    manualHour.match(/\b([01][0-9]|2[0-3]):([0-5][0-9])\b/) &&
                    selectedDate
                  ) {
                    try {
                      const date = new Date(
                        selectedDate?.year!,
                        selectedDate?.month! - 1,
                        selectedDate?.day!,
                        Number(manualHour.split(':')[0]),
                        Number(manualHour.split(':')[1]),
                        0,
                      );
                      await saveManualOutTurn(turn, date);
                      Alert.alert(
                        'Aviso!',
                        'Turno finalizado exitosamente, confírmele al operario que ya puede registrar nuevos turnos.',
                      );
                      setSelectedDate(null);
                      setModalVisible(false);
                    } catch (error) {
                      console.error(error);
                      Alert.alert(
                        'Error!',
                        'Error al finalizar turno manualmente.',
                      );
                    }
                  } else {
                    Alert.alert(
                      'Aviso!',
                      'Debe seleccionar la fecha e indicar hora de finalización del turno en formato 24 hrs. \n\nEjemplo: 04:05 ó 10:40 ó 22:10',
                    );
                  }
                }}>
                <Text style={styles.textStyle}>Enviar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textIn: {
    fontSize: 15,
    color: '#00c060',
  },
  textOut: {
    fontSize: 15,
    color: '#fd5e13',
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
