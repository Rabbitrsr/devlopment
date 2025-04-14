import React, { useState, useCallback } from 'react';
import {
  FlatList, View, Text, TextInput, Alert, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../utils/colors';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import ImagePickerModal from '../../components/ImagePickerModal';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import Modal from 'react-native-modal';

const ManageTeamScreen = () => {
  const navigation = useNavigation();

  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await HttpService.get(api.GET_TEAMS);
      setTeams(data);
    } catch (error) {
      console.log('Error fetching teams', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [fetchTeams])
  );

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (team) => {
    console.log("Opening edit modal for team:", team);
    setEditTeamId(team.id);
    setName(team.name);
    setShortName(team.short_name);
    setLocation(team.place);
    setLogo(null);
    setModalVisible(true);
  };

  const resetForm = () => {
    setName('');
    setShortName('');
    setLocation('');
    setLogo(null);
    setEditTeamId(null);
  };

  const handleSaveTeam = async () => {
    if (!name || !shortName || !location) {
      Alert.alert('Error', 'Please fill all fields (logo optional)');
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
      if (editTeamId) {
        await HttpService.putMultipart(`${api.UPDATE_TEAM}/${editTeamId}`, formData);
        Alert.alert('Success', 'Team updated successfully');
      } else {
        await HttpService.postMultipart(api.ADD_TEAM, formData);
        Alert.alert('Success', 'Team added successfully');
      }
      fetchTeams();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = (id) => {
    Alert.alert('Delete Team', 'Are you sure you want to delete this team?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await HttpService.delete(`${api.DELETE_TEAM}/${id}`);
            Alert.alert('Success', 'Team deleted');
            fetchTeams();
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const renderTeam = ({ item }) => (
    <View style={styles.teamCardContainer}>
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigation.navigate('PlayerListScreen', { teamId: item.id, teamName: item.name })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.logo_url ? (
            <Image source={{ uri: api.API_BASE_URL + item.logo_url }} style={styles.teamLogo} />
          ) : (
            <View style={[styles.teamLogo, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
              <Text>Logo</Text>
            </View>
          )}
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamMeta}>{item.short_name} | {item.place}</Text>
          </View>
        </View>
      </TouchableOpacity>
  
      <View style={styles.iconActionsRow}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionIcon}>
          <Icon name="create-outline" size={20} color="#4ade80" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTeam(item.id)} style={styles.actionIcon}>
          <Icon name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeam}
        contentContainerStyle={styles.teamcontainer}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={openAddModal}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        style={styles.bottomModal}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        backdropOpacity={0.7} 
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editTeamId ? 'Edit Team' : 'Add Team'}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Team Name"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            value={shortName}
            onChangeText={setShortName}
            placeholder="Short Name"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity style={styles.imagePicker} onPress={() => setPickerVisible(true)}>
            {logo ? (
              <Image source={{ uri: logo.uri }} style={styles.logoImage} />
            ) : (
              <Text style={styles.pickImageText}>Tap to select logo (optional)</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveTeam} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{editTeamId ? 'Update Team' : 'Save Team'}</Text>}
          </TouchableOpacity>
        </View>
      </Modal>

      <ImagePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onFileSelected={(file) => setLogo(file)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  teamcontainer : {
    padding: 20,
  },

  teamCardContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  teamCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  iconActionsRow: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  actionIcon: {
    marginLeft: 10,
  },  
  teamLogo: 
  { 
    width: 50,
    height: 50, 
    borderRadius: 25
  },
  teamName: 
  { 
    color: colors.textPrimary, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  teamMeta: 
  { 
    color: colors.textSecondary, 
    marginTop: 4 
  },
  deleteIconContainer: {
    position: 'absolute',
    right: 10,
   // top: -10,
   // backgroundColor: '#fff',
   // borderRadius: 15,
    padding: 5,
   // elevation: 5,
  },  
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: colors.buttonBackground,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  bottomModal: { 
    justifyContent: 'flex-end', 
    margin: 0
  },
  modalContent: {
    backgroundColor: '#1f2937',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: 'white',
    marginBottom: 15,
    height: 50,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: { width: '100%', height: '100%', borderRadius: 10 },
  pickImageText: { color: '#ccc' },
  saveButton: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ManageTeamScreen;
