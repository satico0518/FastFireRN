import React, { useContext } from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import useDateInSpanish from '../hooks/useDateInSpanish';

export const Header = () => {
  const {user} = useContext(AuthContext);  
  
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
      {user?.img ? (
            <Image
              source={{uri: user.img}}
              borderRadius={50}
              style={styles.img}
            />
          ) : (
            <Image
              source={require('../assets/avatar.png')}
              style={styles.img}
            />
          )}
      </View>
      <View style={styles.texts}>
        <Text style={styles.name}>Hola, {user?.name}!</Text>
        <View style={styles.date}>
          <Text style={styles.dateDay}>{useDateInSpanish()} </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  imgContainer: {
    padding: 5,
    borderColor: '#b1b1b1',
    borderWidth: 5,
    borderRadius: 50,
  },
  img: {
    width: 50,
    height: 50,
  },
  texts: {
    marginLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a3a3a',
  },
  date: {
      flexDirection: 'row'
  },
  dateDay: {
      fontSize: 15,
      color: 'green',
  }
});
