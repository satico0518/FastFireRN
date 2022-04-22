import React from 'react'
import { Text, View } from 'react-native'
import { User } from '../interfaces/app-interfaces';

export const UserDetailScreen = ({route}: any) => {
  const user: User = route.params.user;
  
  return (
    <View><Text>Name: {user.name}</Text></View>
  )
}
