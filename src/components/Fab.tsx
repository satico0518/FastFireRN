import React, {FC} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  onPress: () => void;
  backColor: string;
  text?: string;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
}

export const Fab: FC<Props> = ({
  onPress,
  backColor,
  iconName = '',
  text = '',
  style = {},
}) => {
  return (
    <View style={{...(style as any)}}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{...styles.blackButton, backgroundColor: backColor}}>
        {iconName !== '' && (
          <Icon
            name={iconName}
            color="white"
            size={20}
            style={{marginRight: 10}}
          />
        )}
        {text && <Text style={styles.text}>{text}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    width: '100%',
    height: '100%',
    zIndex: 9999,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
