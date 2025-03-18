import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>🏏 Welcome to Cricket Club App 🏏</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
  },
  text: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
