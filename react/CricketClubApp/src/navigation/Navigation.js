import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import your screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import ScorecardScreen from '../screens/ScorecardScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Scorecard') iconName = 'stats-chart-outline';
        else if (route.name === 'Schedule') iconName = 'calendar-outline';
        else if (route.name === 'Events') iconName = 'football-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#ccc',
      tabBarStyle: { backgroundColor: '#2C3E50', height: 60, paddingBottom: 5 },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Scorecard" component={ScorecardScreen} />
    <Tab.Screen name="Schedule" component={ScheduleScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
