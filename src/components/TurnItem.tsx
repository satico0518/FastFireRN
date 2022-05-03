import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Location} from '../hooks/useLocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {convertMsToHM, getLocaleTimeFromDateNumber} from '../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface Turn {
  _id?: string;
  timeIn: number;
  locationIn: Location;
  timeOut?: number;
  locationOut?: Location;
  totalTimeMins?: number;
  extraHourReason?: string;
}

export const TurnItem = ({turn}: {turn: Turn}) => {
  const handleCheckReason = () => {
    Alert.alert('Justificación', turn.extraHourReason)
  }
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
      </View>
      <View>
        <Text style={{color: '#3a3a3a'}}>
          {convertMsToHM(((turn.totalTimeMins || 0) as number) * 60000)} hrs
        </Text>
      </View>
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
});
