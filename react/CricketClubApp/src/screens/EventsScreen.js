import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HttpService from '../services/httpService';
import api, { API_BASE_URL }  from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../utils/colors';

import { useFocusEffect } from '@react-navigation/native';

const EventsScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigation = useNavigation();

  const fetchTournaments = useCallback(async () => {
    try {
      const response = await HttpService.get(api.GET_TOURNAMENTS);
      setTournaments(response);
    } catch (err) {
      console.log('Fetch error:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTournaments();   // ✅ refreshes automatically every time screen focuses
    }, [fetchTournaments])
  );

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this tournament?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await HttpService.delete(`${api.DELETE_TOURNAMENT}/${id}`);
            fetchTournaments();
            Alert.alert('Deleted', 'Tournament deleted successfully');
          } catch (err) {
            Alert.alert('Error', err.message || 'Something went wrong');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const renderTournament = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ManageTournamentScreen', { tournamentData: item })
      }
    >
      <Image
        source={{ uri: `${API_BASE_URL}${item.banner_url}` }}
        style={styles.banner}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.place}>📍 {item.place}</Text>
        <Text style={styles.date}>Start: {new Date(item.start_date).toDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDelete(item.id)}>
        <Icon name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
     <SafeAreaView style={styles.safeArea}>
      
      <View style={{ flex: 1, backgroundColor: colors.primaryGradientEnd }}>
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTournament}
          contentContainerStyle={{ padding: 10 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd, },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  banner: { width: '100%', height: 150 },
  cardContent: { padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  place: { color: '#555', marginTop: 4 },
  date: { color: '#888', marginTop: 2 },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    elevation: 2,
  },
});

export default EventsScreen;
