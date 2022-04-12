import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import useDateInSpanish from '../hooks/useDateInSpanish';

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://noverbal.es/uploads/blog/rostro-de-un-criminal.jpg',
            width: 70,
            height: 70,
          }}
        />
      </View>
      <View style={styles.texts}>
        <Text style={styles.name}>Hola Davo!</Text>
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
    padding: 20,
    alignItems: 'center',
  },
  imgContainer: {
    padding: 5,
    borderColor: '#ff1c1c',
    borderWidth: 5,
    borderRadius: 100,
  },
  img: {
    borderRadius: 100,
  },
  texts: {
    marginLeft: 20,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  date: {
      flexDirection: 'row'
  },
  dateDay: {
      fontSize: 18,
      color: 'green',
  }
});
