import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import colors from '../../utils/colors';

const AddPlayerScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [teamId, setTeamId] = useState('');
  const [photo, setPhoto] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    try {
      const data = await HttpService.get(api.GET_TEAMS);
      setTeams(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load teams');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        const file = response.assets[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
          setPhoto(file);
        } else {
          Alert.alert('Invalid file', 'Please select a PNG or JPG image.');
        }
      }
    );
  };

  const handleAddPlayer = async () => {
    if (!playerName || !playerRole || !teamId) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('playerName', playerName);
    formData.append('playerRole', playerRole);
    formData.append('teamId', teamId);
    if (photo) {
      formData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName,
      });
    }

    setLoading(true);
    try {
      const response = await fetch(api.ADD_PLAYER, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Player added successfully');
        setPlayerName('');
        setPlayerRole('');
        setTeamId('');
        setPhoto(null);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Player Name</Text>
        <TextInput style={styles.input} value={playerName} onChangeText={setPlayerName} placeholder="Player Name" placeholderTextColor="#ccc" />

        <Text style={styles.label}>Player Role</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={playerRole} onValueChange={(value) => setPlayerRole(value)} dropdownIconColor="#fff">
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Batsman" value="Batsman" />
            <Picker.Item label="Bowler" value="Bowler" />
            <Picker.Item label="All-rounder" value="All-rounder" />
          </Picker>
        </View>

        <Text style={styles.label}>Team</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={teamId} onValueChange={(value) => setTeamId(value)} dropdownIconColor="#fff">
            <Picker.Item label="Select Team" value="" />
            {teams.map((team) => (
              <Picker.Item key={team.id} label={team.name} value={team.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Player Photo</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.photoImage} />
          ) : (
            <Text style={styles.pickImageText}>Tap to select photo (PNG/JPG)</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAddPlayer} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Player</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  container: { padding: 20 },
  label: { color: colors.textWhite, marginBottom: 5, fontSize: 16, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.textWhite,
    marginBottom: 15,
    height: 50,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoImage: { width: '100%', height: '100%', borderRadius: 10 },
  pickImageText: { color: '#ccc' },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddPlayerScreen;
