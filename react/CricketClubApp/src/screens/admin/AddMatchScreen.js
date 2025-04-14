import React, { useState, useEffect } from 'react';
import { ScrollView, 
  Text, TextInput, StyleSheet, Alert, 
  TouchableOpacity, View, ActivityIndicator,
  Platform 
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import colors from '../../utils/colors';

const AddMatchScreen = () => {
  const [tournamentId, setTournamentId] = useState('');
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [matchDate, setMatchDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [venue, setVenue] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTournaments = async () => {
    try {
      const data = await HttpService.get(api.GET_TOURNAMENTS);
      setTournaments(data.map(item => ({ label: item.title, value: item.id })));
    } catch (err) {
      Alert.alert('Error', 'Failed to load tournaments');
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await HttpService.get(api.GET_TEAMS);
      setTeams(data.map(team => ({ label: team.name, value: team.id })));
    } catch (err) {
      Alert.alert('Error', 'Failed to load teams');
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      if (Platform.OS === 'android') {
        setMatchDate(selectedDate);
        setShowDatePicker(false);
        setShowTimePicker(true);
      } else {
        setMatchDate(selectedDate);
        setShowDatePicker(false);
      }
    } else {
      setShowDatePicker(false);
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const updatedDateTime = new Date(matchDate);
      updatedDateTime.setHours(selectedTime.getHours());
      updatedDateTime.setMinutes(selectedTime.getMinutes());
      setMatchDate(updatedDateTime);
    }
    setShowTimePicker(false);
  };

  const handleAddMatch = async () => {
    if (!tournamentId || !team1Id || !team2Id || !matchDate || !venue) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await HttpService.post(api.ADD_MATCH, {
        tournamentId,
        team1_id:team1Id,
        team2_id:team2Id,
        match_date: matchDate.toISOString(),
        venue,
      });
      Alert.alert('Success', 'Match scheduled successfully');
      setTournamentId('');
      setTeam1Id('');
      setTeam2Id('');
      setMatchDate(new Date());
      setVenue('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Select Tournament</Text>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdowncontainerStyle}
          placeholderStyle={styles.placeholderText}
          data={tournaments}
          labelField="label"
          valueField="value"
          placeholder="Select Tournament"
          value={tournamentId}
          onChange={item => setTournamentId(item.value)}
        />

        <Text style={styles.label}>Team 1</Text>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdowncontainerStyle}
          placeholderStyle={styles.placeholderText}
          data={teams}
          labelField="label"
          valueField="value"
          placeholder="Select Team 1"
          value={team1Id}
          onChange={item => setTeam1Id(item.value)}
        />

        <Text style={styles.label}>Team 2</Text>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdowncontainerStyle}
          placeholderStyle={styles.placeholderText}
          data={teams}
          labelField="label"
          valueField="value"
          placeholder="Select Team 2"
          value={team2Id}
          onChange={item => setTeam2Id(item.value)}
        />

        <Text style={styles.label}>Match Date & Time</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{matchDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={matchDate}
            mode="date"
            display="calendar"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={matchDate}
            mode="time"
            display="clock"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Venue</Text>
        <TextInput 
        style={styles.input} 
        value={venue}
        onChangeText={setVenue}
        placeholder="Venue"
        placeholderTextColor={styles.placeholderText.color}  />

        <TouchableOpacity style={styles.button} onPress={handleAddMatch} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Match</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  container: { padding: 20 },
  label: { 
     color: colors.textWhite,
     marginBottom: 5, 
     borderRadius: 10,
     fontSize: 16, 
     fontWeight: '600' 
  },
  dropdown: { 
    height: 50, 
    paddingHorizontal: 10, 
    backgroundColor: colors.dropdownbackground,
    borderRadius: 10,
    marginBottom: 15,

  },
  dropdowncontainerStyle:{
     borderRadius: 10,
  },
  placeholderText: {
    color: '#fff',
  },
  input: {
    backgroundColor: colors.dropdownbackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.inputlabel,
    marginBottom: 15,
    height: 50,
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: colors.dropdownbackground,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  dateText: { 
    color: colors.inputlabel, 
    fontSize: 16 
  },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.inputlabel, 
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default AddMatchScreen;
