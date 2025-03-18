import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const EventsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Events Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 24, color: colors.textPrimary },
});

export default EventsScreen;
