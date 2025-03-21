import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';

const AddPlayerScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [teamId, setTeamId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleAddPlayer = () => {
    if (playerName && playerRole && teamId) {
      Alert.alert('Success', 'Player added (API integration pending)');
      setPlayerName('');
      setPlayerRole('');
      setTeamId('');
      setPhotoUrl('');
    } else {
      Alert.alert('Error', 'Please fill all required fields');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Player Name</Text>
        <TextInput style={styles.input} value={playerName} onChangeText={setPlayerName} placeholder="Player Name" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Player Role (Batsman/Bowler/All-rounder)</Text>
        <TextInput style={styles.input} value={playerRole} onChangeText={setPlayerRole} placeholder="Player Role" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Team ID</Text>
        <TextInput style={styles.input} value={teamId} onChangeText={setTeamId} placeholder="Team ID" placeholderTextColor="#ccc" keyboardType="numeric" />

        <Text style={styles.label}>Photo URL (optional)</Text>
        <TextInput style={styles.input} value={photoUrl} onChangeText={setPhotoUrl} placeholder="Player Image URL" placeholderTextColor="#ccc" />

        <Button title="Add Player" onPress={handleAddPlayer} color={colors.buttonBackground} />
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

export default AddPlayerScreen;
