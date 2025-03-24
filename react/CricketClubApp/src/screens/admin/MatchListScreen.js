import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import colors from '../../utils/colors';

const MatchListScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await HttpService.get(api.GET_MATCHES);
      setMatches(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('UpdateScoreScreen', { matchId: item.id, matchName: item.name })
      }
    >
      <Text style={styles.matchTitle}>{item.name}</Text>
      <Text style={styles.detailText}>Venue: {item.venue}</Text>
      <Text style={styles.detailText}>Date: {new Date(item.matchDate).toLocaleString()}</Text>
      <View style={styles.updateBtnWrapper}>
        <Text style={styles.updateBtnText}>Update Score ➡</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrapper}>
        <Text style={styles.heading}>Select Match To Update Score</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.buttonBackground} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  headerWrapper: { marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  matchTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, color: colors.primaryGradientEnd },
  detailText: { fontSize: 14, color: '#444', marginBottom: 4 },
  updateBtnWrapper: {
    backgroundColor: colors.buttonBackground,
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateBtnText: { color: '#fff', fontWeight: '600' },
});

export default MatchListScreen;
