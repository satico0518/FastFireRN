import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {convertMsToHM} from '../utils';
import {Turn, TurnItem} from './TurnItem';

export const TurnList = ({turns, totalHours}: any) => {
  return (
    <View style={styles.registryContent}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 15, color: '#3a3a3a'}}>
          Tiempo acumulado
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 18, color: '#3a3a3a'}}>
          {convertMsToHM(totalHours)} hrs
        </Text>
      </View>
      <View
        style={{
          height: Dimensions.get('screen').height * 0.2,
          marginTop: 10,
        }}>
        <ScrollView>
          {turns.map((turn: Turn) => (
            <TurnItem key={turn.timeIn} turn={turn} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
