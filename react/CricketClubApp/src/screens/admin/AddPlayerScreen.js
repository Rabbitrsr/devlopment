import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import ImagePickerModal from '../../components/ImagePickerModal';
import colors from '../../utils/colors';
import { Picker } from '@react-native-picker/picker';

const AddPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const playerData = route.params?.playerData;
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await HttpService.get(api.GET_TEAMS);
      setTeams(data);
    } catch (err) {
      Alert.alert('Error', err.message || 'Error fetching teams');
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (playerData) {
      setPlayerName(playerData.player_name);
     // setJerseyNumber(playerData.jersey_number.toString());
      setSelectedRole(playerData.player_role);
      setSelectedTeamId(playerData.team_id);
    } else if (route.params?.teamId) {
      setSelectedTeamId(route.params.teamId);
    }
  }, [playerData, route.params?.teamId]);

  const handleSavePlayer = async () => {
    if (!playerName || !jerseyNumber || !selectedRole || !selectedTeamId) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('player_name', playerName);
    formData.append('jersey_number', jerseyNumber);
    formData.append('player_role', selectedRole);
    formData.append('team_id', selectedTeamId);
    if (photo) {
      formData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || photo.name || 'player.jpg',
      });
    }

    setLoading(true);
    try {
      if (playerData?.id) {
        formData.append('id', playerData.id);
        await HttpService.putMultipart(`${api.UPDATE_PLAYER}/${playerData.id}`, formData);
        Alert.alert('Success', 'Player updated successfully');
      } else {
        await HttpService.postMultipart(api.ADD_PLAYER, formData);
        Alert.alert('Success', 'Player added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Player Name</Text>
        <TextInput
          style={styles.input}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Enter player name"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Jersey Number</Text>
        <TextInput
          style={styles.input}
          value={jerseyNumber}
          onChangeText={setJerseyNumber}
          placeholder="Enter jersey number"
          keyboardType="numeric"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(value) => setSelectedRole(value)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Batsman" value="Batsman" />
            <Picker.Item label="Bowler" value="Bowler" />
            <Picker.Item label="All-rounder" value="All-rounder" />
            <Picker.Item label="Wicketkeeper" value="Wicketkeeper" />
          </Picker>
        </View>

        <Text style={styles.label}>Team</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedTeamId}
            onValueChange={(itemValue) => setSelectedTeamId(itemValue)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select team" value="" />
            {teams.map((team) => (
              <Picker.Item key={team.id} label={team.name} value={team.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Player Photo (optional)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => setPickerVisible(true)}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.selectedImage} />
          ) : (
            <Text style={{ color: '#ccc' }}>Tap to select player image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSavePlayer} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{playerData ? 'Update Player' : 'Add Player'}</Text>
          )}
        </TouchableOpacity>

        <ImagePickerModal
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onFileSelected={(file) => setPhoto(file)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  container: { padding: 20 },
  label: { color: colors.textWhite, fontWeight: '600', marginBottom: 5 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff',
    marginBottom: 15,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 15,
  },
  dropdown: { color: '#fff' },
  imagePicker: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedImage: { width: '100%', height: '100%', borderRadius: 10 },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default AddPlayerScreen;
