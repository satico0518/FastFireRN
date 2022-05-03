import React  from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const TurnsDateControl = ({isLoading, currentDay, setCurrentDay}: any) => {
  const onGoBack = () => setCurrentDay('Ayer');
  const onGoForward = () => setCurrentDay('Hoy');

  return (
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
        disabled={isLoading}
        onPress={onGoBack}
        style={[
          styles.arrows,
          currentDay === 'Ayer' || isLoading ? styles.disabledArrow : null,
        ]}>
        {currentDay !== 'Ayer' ? (
          <Icon name="arrow-back" color="#3a3a3a" size={20} />
        ) : (
          <Text />
        )}
      </TouchableOpacity>
      <Text style={{fontWeight: 'bold', fontSize: 18, color: '#3a3a3a'}}>
        {currentDay}
      </Text>
      <TouchableOpacity
        onPress={onGoForward}
        style={[
          styles.arrows,
          currentDay === 'Hoy' || isLoading ? styles.disabledArrow : null,
        ]}
        disabled={currentDay === 'Hoy' || isLoading}>
        {currentDay !== 'Hoy' ? (
          <Icon name="arrow-forward" color="#3a3a3a" size={20} />
        ) : (
          <Text />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  arrows: {
    borderColor: '#555555',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3,
  },
  disabledArrow: {
    borderWidth: 0,
  },
});
