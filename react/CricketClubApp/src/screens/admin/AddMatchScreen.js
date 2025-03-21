import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';

const AddMatchScreen = () => {
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [venue, setVenue] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  const handleAddMatch = () => {
    if (team1Id && team2Id && matchDate && venue && tournamentId) {
      Alert.alert('Success', 'Match scheduled (API integration pending)');
      setTeam1Id('');
      setTeam2Id('');
      setMatchDate('');
      setVenue('');
      setTournamentId('');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Team 1 ID</Text>
        <TextInput style={styles.input} value={team1Id} onChangeText={setTeam1Id} placeholder="Team 1 ID" placeholderTextColor="#ccc" keyboardType="numeric" />

        <Text style={styles.label}>Team 2 ID</Text>
        <TextInput style={styles.input} value={team2Id} onChangeText={setTeam2Id} placeholder="Team 2 ID" placeholderTextColor="#ccc" keyboardType="numeric" />

        <Text style={styles.label}>Match Date (YYYY-MM-DD HH:MM)</Text>
        <TextInput style={styles.input} value={matchDate} onChangeText={setMatchDate} placeholder="Date & Time" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Venue</Text>
        <TextInput style={styles.input} value={venue} onChangeText={setVenue} placeholder="Venue" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Tournament ID</Text>
        <TextInput style={styles.input} value={tournamentId} onChangeText={setTournamentId} placeholder="Tournament ID" placeholderTextColor="#ccc" keyboardType="numeric" />

        <Button title="Add Match" onPress={handleAddMatch} color={colors.buttonBackground} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  container: { padding: 20 },
  label: { color: colors.textWhite, marginBottom: 5 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.textWhite,
    marginBottom: 15,
    height: 45,
  },
});

export default AddMatchScreen;
