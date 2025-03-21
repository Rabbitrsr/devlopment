import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import API from '../api/api';

const EventsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
      {API.events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <Image source={event.banner} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.eventInfo}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.text}>📍 {event.place}</Text>
            <Text style={styles.text}>📅 {event.date}</Text>
            <Text style={styles.text}>💰 {event.fee}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  sectionTitle: { fontSize: 20, color: colors.textWhite, marginBottom: 15 },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  bannerImage: { width: '100%', height: 180 },
  eventInfo: { padding: 12 },
  title: { color: colors.textWhite, fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  text: { color: '#ddd', fontSize: 14, marginVertical: 2 },
});

export default EventsScreen;
