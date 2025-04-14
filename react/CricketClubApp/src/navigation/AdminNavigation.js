import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AdminBottomTabNavigation from './AdminBottomTabNavigation';
import ManageTournamentScreen from '../screens/admin/ManageTournamentScreen';
import MatchSetupScreen from '../screens/admin/MatchSetupScreen';
import UpdateScoreScreen from '../screens/admin/UpdateScoreScreen';
import AddPlayerScreen from '../screens/admin/AddPlayerScreen';
import PlayerListScreen from '../screens/PlayerListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../utils/colors';


const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.drawerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => console.log('User logged out') },
          ]);
        }}
      >
        <Text style={styles.drawerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Drawer Navigator
const AdminNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Dashboard" component={AdminBottomTabNavigation} />
      <Drawer.Screen name="ManageTournamentScreen" component={ManageTournamentScreen} />
      <Drawer.Screen name="AddPlayer" component={AddPlayerScreen} />
      <Drawer.Screen name="PlayerListScreen" component={PlayerListScreen} />
      <Drawer.Screen name="MatchSetupScreen" component={MatchSetupScreen} />
      <Drawer.Screen name="UpdateScoreScreen" component={UpdateScoreScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: { 
    flex: 1, 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    backgroundColor: colors.primaryGradientEnd 
  },
  drawerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  drawerText: 
  { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.textWhite
  },
});

export default AdminNavigation;
