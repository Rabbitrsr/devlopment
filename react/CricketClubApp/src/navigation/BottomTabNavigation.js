import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ScorecardScreen from '../screens/ScorecardScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Scorecard') iconName = 'stats-chart-outline';
          else if (route.name === 'Schedule') iconName = 'calendar-outline';
          else if (route.name === 'Events') iconName = 'trophy-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.buttonBackground,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.primaryGradientEnd },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scorecard" component={ScorecardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;