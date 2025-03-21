import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';

const AddTeamScreen = () => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const handleAddTeam = () => {
    if (name && shortName && logoUrl) {
      Alert.alert('Success', 'Team added (API integration pending)');
      setName('');
      setShortName('');
      setLogoUrl('');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Team Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Team Name" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Short Name (e.g., MI, CSK)</Text>
        <TextInput style={styles.input} value={shortName} onChangeText={setShortName} placeholder="Short Name" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Logo URL</Text>
        <TextInput style={styles.input} value={logoUrl} onChangeText={setLogoUrl} placeholder="Logo Image URL" placeholderTextColor="#ccc" />

        <Button title="Add Team" onPress={handleAddTeam} color={colors.buttonBackground} />
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

export default AddTeamScreen;
