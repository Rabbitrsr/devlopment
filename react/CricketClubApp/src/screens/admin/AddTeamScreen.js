import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, Alert, StyleSheet,
  TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import ImagePickerModal from '../../components/ImagePickerModal';

const AddTeamScreen = () => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleAddTeam = async () => {
    if (!name || !shortName || !location) {
      Alert.alert('Error', 'Please fill all fields except logo (optional)');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('shortname', shortName);
    formData.append('place', location);
    if (logo) {
      formData.append('logo', {
        uri: logo.uri,
        type: logo.type,
        name: logo.fileName || logo.name || 'team_logo.jpg',
      });
    }
  
    setLoading(true);
  
    try {
      await HttpService.postMultipart(api.ADD_TEAM, formData);
      Alert.alert('Success', 'Team added successfully');
      setName('');
      setShortName('');
      setLocation('');
      setLogo(null);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Team Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Team Name"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Short Name (e.g., MI, CSK)</Text>
        <TextInput
          style={styles.input}
          value={shortName}
          onChangeText={setShortName}
          placeholder="Short Name"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Team Logo (Optional)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={() => setPickerVisible(true)}>
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logoImage} />
          ) : (
            <Text style={styles.pickImageText}>Tap to select logo (optional)</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAddTeam} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Team</Text>}
        </TouchableOpacity>

        <ImagePickerModal
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onFileSelected={(file) => setLogo(file)}
        />
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
  imagePicker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: { width: '100%', height: '100%', borderRadius: 10 },
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

export default AddTeamScreen;
