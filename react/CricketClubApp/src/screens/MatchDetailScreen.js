import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';
import API from '../api/api';

const MatchDetailScreen = ({ route }) => {
  const { matchId } = route.params;
  const matchData = API.matchDetails[matchId];

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <Text style={styles.matchSummary}>{matchData.matchSummary}</Text>

      {matchData.innings.map((inning, index) => (
        <View key={index} style={styles.inningContainer}>
          <Text style={styles.inningTitle}>{inning.battingTeam} - {inning.battingScore}</Text>

          <Text style={styles.sectionHeader}>Batting</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Player</Text>
            <Text style={styles.thSmall}>R</Text>
            <Text style={styles.thSmall}>B</Text>
            <Text style={styles.thSmall}>4s</Text>
            <Text style={styles.thSmall}>6s</Text>
            <Text style={styles.thSmall}>SR</Text>
          </View>
          {inning.batting.map((player, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.td}>{player.name}</Text>
              <Text style={styles.tdSmall}>{player.runs}</Text>
              <Text style={styles.tdSmall}>{player.balls}</Text>
              <Text style={styles.tdSmall}>{player.fours}</Text>
              <Text style={styles.tdSmall}>{player.sixes}</Text>
              <Text style={styles.tdSmall}>{player.sr}</Text>
            </View>
          ))}

          <Text style={styles.fowText}>FOW: {inning.fow}</Text>

          <Text style={styles.sectionHeader}>Bowling</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Bowler</Text>
            <Text style={styles.thSmall}>O</Text>
            <Text style={styles.thSmall}>R</Text>
            <Text style={styles.thSmall}>W</Text>
            <Text style={styles.thSmall}>Eco</Text>
          </View>
          {inning.bowlingAgainst.map((bowler, j) => (
            <View key={j} style={styles.tableRow}>
              <Text style={styles.td}>{bowler.name}</Text>
              <Text style={styles.tdSmall}>{bowler.overs}</Text>
              <Text style={styles.tdSmall}>{bowler.runs}</Text>
              <Text style={styles.tdSmall}>{bowler.wickets}</Text>
              <Text style={styles.tdSmall}>{bowler.eco}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  matchSummary: { fontSize: 20, color: colors.textWhite, marginBottom: 20, fontWeight: 'bold' },
  inningContainer: { marginBottom: 30 },
  inningTitle: { fontSize: 18, color: colors.textWhite, marginBottom: 10, fontWeight: 'bold' },
  sectionHeader: { fontSize: 16, color: colors.buttonBackground, marginTop: 10, marginBottom: 5 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  th: { color: '#ccc', flex: 2 },
  thSmall: { color: '#ccc', flex: 0.7, textAlign: 'center' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  td: { color: colors.textWhite, flex: 2 },
  tdSmall: { color: colors.textWhite, flex: 0.7, textAlign: 'center' },
  fowText: { color: '#aaa', marginTop: 5, fontStyle: 'italic' },
});

export default MatchDetailScreen;
