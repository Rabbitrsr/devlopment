import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';

const MatchPlayersScreen = ({ route }) => {
  const { match } = route.params;

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <Text style={styles.header}>{match.team1.name} Squad</Text>
      {match.team1.players.map((player, index) => (
        <Text key={index} style={styles.playerName}>{player}</Text>
      ))}

      <Text style={styles.header}>{match.team2.name} Squad</Text>
      {match.team2.players.map((player, index) => (
        <Text key={index} style={styles.playerName}>{player}</Text>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  header: { fontSize: 20, color: colors.buttonBackground, marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  playerName: { color: colors.textWhite, fontSize: 16, marginVertical: 4 },
});

export default MatchPlayersScreen;
