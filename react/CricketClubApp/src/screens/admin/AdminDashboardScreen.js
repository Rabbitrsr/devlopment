import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import colors from '../../utils/colors';

const AdminDashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome, Admin! 👑</Text>
      <Text style={styles.text}>Use the tabs below to manage teams, tournaments, players, matches & scores.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primaryGradientEnd, padding: 20 },
  text: { color: colors.textWhite, fontSize: 18, textAlign: 'center', marginBottom: 10 },
});

export default AdminDashboardScreen;
