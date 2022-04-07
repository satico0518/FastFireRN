import React from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://img2.freepng.es/20180623/iqh/kisspng-computer-icons-avatar-social-media-blog-font-aweso-avatar-icon-5b2e99c40ce333.6524068515297806760528.jpg',
            width: 70,
            height: 70,
          }}
        />
      </View>
      <View style={styles.texts}>
        <Text style={styles.name}>Hola Pedro!</Text>
        <View style={styles.date}>
          <Text style={styles.dateHour}>9:50</Text>
          <Text style={styles.dateDay}>/ 26 Jun </Text>
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
    borderColor: 'gray',
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
  dateHour: {
      fontSize: 18,
  },
  dateDay: {
      fontSize: 18,
      color: 'green',
      marginLeft: 10
  }
});
