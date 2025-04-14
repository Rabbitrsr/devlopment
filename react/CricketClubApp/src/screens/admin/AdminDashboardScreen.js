import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have this installed
import colors from '../../utils/colors'; // adjust import if needed

const AdminDashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
          <Icon name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Admin Dashboard</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.text}>Welcome, Admin! 👑</Text>
        <Text style={styles.text}>
          Use the tabs below to manage teams, tournaments, players, matches & scores.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryGradientEnd,
    paddingTop:'30'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.primaryGradientEnd,
   // elevation: 4, // Adds shadow (Android)
  //  shadowOpacity: 0.2, // Adds shadow (iOS)
  },
  menuButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AdminDashboardScreen;
