import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AddTournamentScreen from '../screens/admin/AddTournamentScreen';
import AddTeamScreen from '../screens/admin/AddTeamScreen';
import AddPlayerScreen from '../screens/admin/AddPlayerScreen';
import AddMatchScreen from '../screens/admin/AddMatchScreen';
import UpdateScoreScreen from '../screens/admin/UpdateScoreScreen';
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
          else if (route.name === 'AddTournament') iconName = 'trophy-outline';
          else if (route.name === 'AddTeam') iconName = 'people-outline';
          else if (route.name === 'AddPlayer') iconName = 'person-add-outline';
          else if (route.name === 'AddMatch') iconName = 'calendar-outline';
          else if (route.name === 'UpdateScore') iconName = 'stats-chart-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="AddTournament" component={AddTournamentScreen} />
      <Tab.Screen name="AddTeam" component={AddTeamScreen} />
      <Tab.Screen name="AddPlayer" component={AddPlayerScreen} />
      <Tab.Screen name="AddMatch" component={AddMatchScreen} />
      <Tab.Screen name="UpdateScore" component={UpdateScoreScreen} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabNavigation;
