import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../utils/colors';
import API from '../api/api';
import { useNavigation } from '@react-navigation/native';

const ScorecardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Matches</Text>
      {API.recentMatches.map((match) => (
        <TouchableOpacity
        key={match.id}
        style={styles.matchCard}
        onPress={() => navigation.navigate('MatchDetail', { matchId: match.matchId })}
      >
        <Text style={styles.teamText}>{match.team1.name}: {match.team1.score}</Text>
        <Text style={styles.teamText}>{match.team2.name}: {match.team2.score}</Text>
        <Text style={styles.winnerText}>{match.winner}</Text>
      </TouchableOpacity>
      
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  sectionTitle: { fontSize: 20, color: colors.textWhite, marginBottom: 15 },
  matchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  teamText: { color: colors.textWhite, fontSize: 16 },
  winnerText: { color: colors.buttonBackground, marginTop: 5, fontWeight: 'bold' },
});

export default ScorecardScreen;
