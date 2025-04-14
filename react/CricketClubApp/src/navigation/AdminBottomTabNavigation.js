import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageTeamScreen from '../screens/admin/ManageTeamScreen';
import AddPlayerScreen from '../screens/admin/AddPlayerScreen';
import AddMatchScreen from '../screens/admin/AddMatchScreen';
import MatchListScreen from '../screens/admin/MatchListScreen';
import EventsScreen from '../screens/EventsScreen';
import ManageTournamentStackNavigator from './ManageTournamentStackNavigator'; // ✅ Import stack
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';

const Tab = createBottomTabNavigator();

const AdminBottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.buttonBackground,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'ManageTournament') iconName = 'trophy-outline';
          else if (route.name === 'ManageTeam') iconName = 'people-outline';
          else if (route.name === 'AddPlayer') iconName = 'person-add-outline';
          else if (route.name === 'AddMatch') iconName = 'calendar-outline';
          else if (route.name === 'MatchList') iconName = 'stats-chart-outline';
          else if (route.name === 'Events') iconName = 'calendar-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen
        name="ManageTournament"
        component={ManageTournamentStackNavigator} // ✅ use stack here
        options={{ tabBarLabel: 'Add Tournament' }}
      />
      <Tab.Screen name="ManageTeam" component={ManageTeamScreen} />
      <Tab.Screen name="AddPlayer" component={AddPlayerScreen} />
      <Tab.Screen name="AddMatch" component={AddMatchScreen} />
      <Tab.Screen name="MatchList" component={MatchListScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabNavigation;
