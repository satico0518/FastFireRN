import {Dimensions, StyleSheet} from 'react-native';

export const authStyles = StyleSheet.create({
  text: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
  },
  text2: {
    fontSize: 13,
    color: 'white',
    marginBottom: 30,
  },
  inputWrapper: {
    width: Dimensions.get('screen').width * 0.8,
    backgroundColor: '#3d3d3dca',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
    paddingLeft: 30,
  },
  input: {
    width: '100%',
    color: 'white',
    fontSize: 20,
    marginLeft: 15,
  },
  loginButton: {
    width: Dimensions.get('screen').width * 0.8,
    backgroundColor: '#e93535',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  smallLink: {
    color: '#333',
  },
});
