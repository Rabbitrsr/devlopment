import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import API from '../api/api';
import { useNavigation } from '@react-navigation/native';

const ScheduleScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <Text style={styles.sectionTitle}>Upcoming Matches</Text>
      {API.upcomingMatches.map((match) => (
        <TouchableOpacity
          key={match.id}
          style={styles.matchCard}
          onPress={() => navigation.navigate('MatchPlayers', { match })}
        >
          <Text style={styles.dateText}>{match.date} | {match.time}</Text>
          <Text style={styles.teamsText}>{match.team1.name} vs {match.team2.name}</Text>
          <Text style={styles.venueText}>{match.venue}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  sectionTitle: { fontSize: 20, color: colors.textWhite, marginBottom: 15 },
  matchCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  dateText: { color: colors.textWhite, fontSize: 14, marginBottom: 5 },
  teamsText: { color: colors.textWhite, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  venueText: { color: '#ccc', fontSize: 14 },
});

export default ScheduleScreen;
