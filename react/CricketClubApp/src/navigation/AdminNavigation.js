import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminBottomTabNavigation from './AdminBottomTabNavigation';
import ManageTournamentScreen from '../screens/admin/ManageTournamentScreen';
import UpdateScoreScreen from '../screens/admin/UpdateScoreScreen';

const Stack = createStackNavigator();

const AdminNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminBottomTabNavigation} />
      <Stack.Screen name="ManageTournamentScreen" component={ManageTournamentScreen} />
      <Stack.Screen name="UpdateScoreScreen" component={UpdateScoreScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigation;
