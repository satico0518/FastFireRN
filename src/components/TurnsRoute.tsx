import React, {useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ffApi from '../api';
import {Turn, TurnItem} from './TurnItem';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Fab } from './Fab';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febreo',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene.',
    'Feb.',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul.',
    'Ago',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dic.',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mir.', 'Jue.', 'Vie.', 'Sab.'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export const TurnsRoute = ({_id}: {_id: string}) => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isCalendarVisible, setCalendarVisibility] = useState(true);

  const getTurns = async (date: DateData) => {      
    try {
      const turnsApi = await ffApi.get(
        `/turns/${_id}?date=${date.dateString}`,
      ); 

      setTurns(turnsApi.data);
      setCalendarVisibility(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ececec', padding: 20}}>
      <Text style={{marginBottom: 10, fontWeight: '600', color: '#3a3a3a'}}>
        Seleccione una fecha o un rango de fechas
      </Text>
      {isCalendarVisible ? (
        <Calendar
          minDate={'2022-04-01'}
          maxDate={'2022-04-25'}
          onDayPress={getTurns}
          monthFormat={'MMMM yyyy'}
          disableMonthChange={false}
          firstDay={1}
          markedDates={{
            // '2022-04-19': {
            //   selected: true,
            //   marked: true,
            //   dotColor: 'red',
            //   selectedColor: '#f00',
            //   selectedTextColor: '#fff',
            // },
            // '2022-04-20': {
            //   selected: true,
            //   marked: true,
            //   dotColor: 'red',
            //   selectedColor: '#f00',
            //   selectedTextColor: '#fff',
            // },
            // '2022-04-21': {
            //   selected: true,
            //   marked: true,
            //   dotColor: 'red',
            //   selectedColor: '#f00',
            //   selectedTextColor: '#fff',
            // },
          }}
          disableAllTouchEventsForDisabledDays={true}
          theme={{
            arrowColor: '#f00',
            todayTextColor: '#f00',
          }}
        />
      ) : (<Fab 
        style={{height: 45}}
        backColor='#f00'
        text='Ver Calendario'
        onPress={() => setCalendarVisibility(true)}
      />)}
      {turns.length ? (
        <FlatList
          data={turns}
          renderItem={({item}) => <TurnItem turn={item} />}
        />
      ) : (
        !isCalendarVisible && <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <Text style={{ color: '#3a3a3a'}}>No hay turnos para estas fechas</Text>
            </View>
      )}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccione Mes</Text>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                {height: 40, width: '100%'},
              ]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Buscar</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
