import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import ForgetPasswordScreen from './../screens/ForgetPasswordScreen';
import BottomTabNavigation from './BottomTabNavigation';
import MatchDetailScreen from './../screens/MatchDetailScreen';

import MatchPlayersScreen from './../screens/MatchPlayersScreen';




const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        
        {/* After login, this will show bottom tabs */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigation} />

        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <Stack.Screen name="MatchPlayers" component={MatchPlayersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
