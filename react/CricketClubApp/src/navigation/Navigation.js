import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import ForgetPasswordScreen from './../screens/ForgetPasswordScreen';
import MatchDetailScreen from './../screens/MatchDetailScreen';
import MatchPlayersScreen from './../screens/MatchPlayersScreen';
import BottomTabNavigation from './BottomTabNavigation';
import AdminNavigation from './AdminNavigation'; 

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <Stack.Screen name="MatchPlayers" component={MatchPlayersScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigation} />
        <Stack.Screen name="AdminTabs" component={AdminNavigation} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
