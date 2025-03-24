import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageTournamentScreen from '../screens/admin/ManageTournamentScreen';

const Stack = createStackNavigator();

const ManageTournamentStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ManageTournamentScreen"
      component={ManageTournamentScreen}
    />
  </Stack.Navigator>
);

export default ManageTournamentStackNavigator;
