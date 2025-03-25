import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView, ActivityIndicator,
  TouchableOpacity, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../utils/colors';
import api from '../../services/api';
import HttpService from '../../services/httpService';
import ImagePickerModal from '../../components/ImagePickerModal';
import { useFocusEffect } from '@react-navigation/native';

const ManageTournamentScreen = ({ route, navigation }) => {
    const { tournamentData } = route.params || {};

    const [title, setTitle] = useState('');
    const [place, setPlace] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [entryFee, setEntryFee] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

  
    useEffect(() => {
      if (tournamentData) {
        console.log("Pre-filling data for edit");
        setTitle(tournamentData.title);
        setPlace(tournamentData.place);
        setStartDate(new Date(tournamentData.start_date));
        setEndDate(new Date(tournamentData.end_date));
        setEntryFee(tournamentData.entry_fee);
        setBannerImage(null);
      }

    }, []);

    const resetForm = () => {
      setTitle('');
      setPlace('');
      setStartDate(null);
      setEndDate(null);
      setEntryFee('');
      setBannerImage(null);
    };
      

  const handleSubmit = async () => {
    if (!title || !place || !startDate || !endDate || !entryFee) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('place', place);
    formData.append('start_date', startDate.toISOString().split('T')[0]);
    formData.append('end_date', endDate.toISOString().split('T')[0]);
    formData.append('entry_fee', entryFee);
    if (bannerImage) {
      formData.append('banner', {
        uri: bannerImage.uri,
        type: bannerImage.type,
        name: bannerImage.fileName || bannerImage.name || 'banner.jpg',
      });
    }

    setLoading(true);

    try {
      if (tournamentData) {
        await HttpService.putMultipart(`${api.UPDATE_TOURNAMENT}/${tournamentData.id}`, formData);

        Alert.alert('Success', 'Tournament updated successfully');

        navigation.goBack();
      } 
      else {
        await HttpService.postMultipart(api.ADD_TOURNAMENT, formData);

        Alert.alert('Success', 'Tournament added successfully');

        resetForm();

        navigation.navigate('Events');
      }
    
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate, isStart) => {
    if (selectedDate) {
      isStart ? setStartDate(selectedDate) : setEndDate(selectedDate);
      isStart ? setShowStartPicker(false) : setShowEndPicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Tournament Name</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Tournament Name"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Place</Text>
        <TextInput
          style={styles.input}
          value={place}
          onChangeText={setPlace}
          placeholder="Venue / Place"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>
            {startDate ? startDate.toDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => handleDateChange(event, date, true)}
          />
        )}

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>
            {endDate ? endDate.toDateString() : 'Select End Date'}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            minimumDate={startDate || new Date()}
            onChange={(event, date) => handleDateChange(event, date, false)}
          />
        )}

        <Text style={styles.label}>Entry Fee</Text>
        <TextInput
          style={styles.input}
          value={entryFee}
          onChangeText={setEntryFee}
          placeholder="Entry Fee"
          keyboardType="numeric"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Tournament Banner</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setPickerVisible(true)}>
          <Text style={styles.dateText}>
            {bannerImage
              ? 'Banner Selected (Tap to change)'
              : tournamentData?.banner_url
              ? 'Banner exists (Tap to change)'
              : 'Select Banner Image'}
          </Text>
        </TouchableOpacity>
        {bannerImage && (
          <Image
            source={{ uri: bannerImage.uri }}
            style={{ width: '100%', height: 150, borderRadius: 10, marginVertical: 10 }}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {tournamentData ? 'Update Tournament' : 'Add Tournament'}
            </Text>
          )}
        </TouchableOpacity>

        <ImagePickerModal
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onFileSelected={(file) => setBannerImage(file)}
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
  datePicker: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  dateText: { color: '#fff', fontSize: 16 },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ManageTournamentScreen;
