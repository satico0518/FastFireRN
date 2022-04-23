import React, {useState} from 'react';
import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ffApi from '../api';
import {Turn, TurnItem} from './TurnItem';

export const TurnsRoute = ({_id}: {_id: string}) => {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const getTurns = async (date: Date) => {
    try {
      const turnsApi = await ffApi.get(
        `/turns/${_id}?date=${date?.toISOString().split('T')[0]}`,
      );

      setTurns(turnsApi.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    getTurns(date);
    hideDatePicker();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ececec', padding: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={showDatePicker}>
          <Text>Por Fecha</Text>
        </Pressable>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text>Por Mes</Text>
        </Pressable>
      </View>

      {turns.length ? (
        <FlatList
          data={turns}
          renderItem={({item}) => <TurnItem turn={item} />}
        />
      ) : (
        <Text>No hay turnos registardos</Text>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date('2022-04-20')}
        maximumDate={new Date()}
      />
      <Modal
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
              style={[styles.button, styles.buttonClose, {height: 40, width: '100%'}]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Buscar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
