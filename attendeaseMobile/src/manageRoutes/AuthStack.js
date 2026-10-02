import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Login } from '../screens/authFlow/LoginScreen';
// import { AuthStack } from './AuthStack';
const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
        {/* <Stack.Screen options={{headerShown: false}} name="AuthScreen" component={AuthScreen} /> */}
    </Stack.Navigator>
  );
};