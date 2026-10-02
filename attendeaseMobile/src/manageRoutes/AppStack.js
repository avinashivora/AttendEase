import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreatePortal } from "../screens/appFlow/CreatePortal"
import { ScreenTwo } from "../screens/appFlow/ScreenTwo"
// import { AuthStack } from './AuthStack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/Auth';
import PortalsScreen from '../screens/appFlow/PortalsScreen';
import { View } from 'react-native';
import { Text } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawer';
import SinglePortal from '../screens/appFlow/SinglePortal';
import { IconButton } from 'react-native-paper';
import { ResetPassword } from '../screens/appFlow/ResetPassword';
import StudentAttendance from '../screens/appFlow/StudentAttendance';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator()

export const AppStack = () => {

  const { authData } = useAuth()

  const navigation = useNavigation()

  // console.log("USE AUTH", authData.user.role)  

  return (
    <Stack.Navigator >
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => (
          <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            {authData.user.role === 0 ? <>
              <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="ScreenOne" component={ScreenTwo} />
              <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="Reset Password" component={ResetPassword} />
              <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="Attendance" component={StudentAttendance} />
            </>
              :
              <>
                <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="Create Portal" component={CreatePortal} />
                <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="View Portals" component={PortalsScreen} />
                <Drawer.Screen options={{ headerTitle: 'AttendEase v0.2.0' }} name="Reset Password" component={ResetPassword} />
                <Stack.Screen options={({ navigation }) => ({
                  title: 'AttendEase v0.2.0',
                  headerLeft: () => (
                    <IconButton
                      icon="arrow-left" // Use 'arrow-left' icon for back button
                      onPress={() => navigation.navigate('View Portals')}
                    />
                  ),
                })} name="Single Portal" component={SinglePortal} />
              </>
            }
          </Drawer.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};