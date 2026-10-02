import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from "../screens/appFlow/CreatePortal"
import {AuthScreen} from "../screens/appFlow/ScreenTwo"
// import { AuthStack } from './AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/Auth';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { Loading } from '../components/LoadingScreen';
const Stack = createNativeStackNavigator();

export const Router = () => {

  const {authData, loading} = useAuth()

  if (loading) {
    return <Loading/>
  }

  return (
    <NavigationContainer>
        {authData ? <AppStack/> : <AuthStack/>}
    </NavigationContainer>
  );
};