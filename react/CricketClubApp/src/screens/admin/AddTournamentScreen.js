import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';

const AddTournamentScreen = () => {
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entryFee, setEntryFee] = useState('');

  const handleSubmit = () => {
    if (title && place && startDate && endDate && entryFee) {
      Alert.alert('Success', 'Tournament Added (API integration pending)');
      setTitle('');
      setPlace('');
      setStartDate('');
      setEndDate('');
      setEntryFee('');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Tournament Name</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Tournament Name" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Place</Text>
        <TextInput style={styles.input} value={place} onChangeText={setPlace} placeholder="Venue / Place" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Start Date" placeholderTextColor="#ccc" />

        <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="End Date" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Entry Fee</Text>
        <TextInput style={styles.input} value={entryFee} onChangeText={setEntryFee} placeholder="Entry Fee" placeholderTextColor="#ccc" />

        <Button title="Add Tournament" onPress={handleSubmit} color={colors.buttonBackground} />
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

export default AddTournamentScreen;
