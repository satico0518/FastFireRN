import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {TurnsRoute} from '../components/TurnsRoute';
import {User} from '../interfaces/app-interfaces';
import {translateRoles} from '../utils';

export const UserDetailScreen = ({route}: any) => {
  const {_id, identification, name, role, createdDate, isActive, img}: User =
    route.params.user;
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const [routes] = useState([
    {key: 'turns', title: 'Turnos'},
    {key: 'payroll', title: 'Nomina'},
    {key: 'edit', title: 'Editar'},
  ]);

  const PayrolldRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ececec'}}>
      <Text>Nómina</Text>
    </View>
  );

  const EditRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ececec'}}>
      <Text>Editar</Text>
    </View>
  );

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'turns':
        return <TurnsRoute _id={_id} />;
      case 'payroll':
        return <PayrolldRoute />;
      case 'edit':
        return <EditRoute />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.header}>
        <View>
          {img ? (
            <Image
              defaultSource={require('../assets/avatar.png')}
              source={{uri: img}}
              style={{width: 100, height: 100}}
            />
          ) : (
            <Image
              source={require('../assets/avatar.png')}
              style={{width: 100, height: 100}}
            />
          )}
        </View>
        <View style={styles.content}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.id}>ID {identification}</Text>
            <Text style={styles.role}>Cargo: {translateRoles(role)}</Text>
            <Text style={styles.state}>
              Estado: {isActive ? 'Activo' : 'Inactivo'}
            </Text>
            <Text style={styles.date}>
              Fecha de Creación: {createdDate.split('T')[0]}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <TabView
          style={{marginTop: 20}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              contentContainerStyle={{backgroundColor: '#e4e4e4'}}
              inactiveColor="#808080"
              activeColor="#f00"
              pressColor="#fff"
              {...props}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a3a3a',
  },
  id: {
    fontSize: 12,
    color: '#3a3a3a',
  },
  role: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  state: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  date: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  menuItem: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F00',
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
