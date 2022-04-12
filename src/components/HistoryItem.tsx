import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Location } from '../hooks/useLocation';
import Icon from 'react-native-vector-icons/Ionicons';

export interface History {
    initTime: number;
    initLocation: Location;
    endTime?: number;
    endLocation?: Location;
  }

const getHourFromTime = (time: number): string => {
    const date = new Date(time);
    const minutes = date.getMinutes();
    return date.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes);
  };

export const HistoryItem = (history:History) => {
  return (
    <View style={styles.itemWrapper}>
      <Text style={styles.text}>{getHourFromTime(history.initTime)}</Text>
      <Icon name='arrow-forward-outline' size={25}/>
      <Text style={styles.text}>{history.endTime ? getHourFromTime(history.endTime as number) : '...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 20
    }
})