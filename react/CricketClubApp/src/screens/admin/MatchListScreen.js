import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Alert, RefreshControl, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HttpService from '../../services/httpService';
import api from '../../services/api';
import colors from '../../utils/colors';

const Tab = createMaterialTopTabNavigator();

const MatchListScreen = () => {

  const navigation = useNavigation();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const userRole = 'admin'; // Assume user role is fetched dynamically

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await HttpService.get(api.GET_MATCHES);
      setMatches(response || []); // Ensure response is properly set
    } catch (error) {
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMatches().finally(() => setRefreshing(false));
  }, []);

  const checkMatchSetup = async (matchId) => {

    const res = await HttpService.get(`${api.GET_MATCH_SETUP}/${matchId}`);
    
    if (res.setupStatus.status) {
      // Proceed to scoring screen
      return true
    } 

    return false; 
  };
  

  const handleUpdateScore = async (match) => {
    const setupComplete = await checkMatchSetup(match.id); // You’ll implement this below
  
    if (!setupComplete) {
      navigation.navigate('MatchSetupScreen', { matchId: match.id });
    } else {
      navigation.navigate('UpdateScoreScreen', { matchId: match.id });
    }
  };
  

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => setSelectedMatch(item)}
    >
      <Text style={styles.matchTitle}>
        {item.team1_name || 'Team 1'} vs {item.team2_name || 'Team 2'}
      </Text>
      <Text style={styles.detailText}>Venue: {item.venue || 'Unknown'}</Text>
      <Text style={styles.detailText}>
        Date: {item.match_date ? new Date(item.match_date).toLocaleString() : 'TBA'}
      </Text>
      <Text style={styles.statusText}>Status: {item.status || 'Unknown'}</Text>
      {userRole === 'admin' && (
        <TouchableOpacity 
        style={styles.updateBtnWrapper}  
        onPress={() => handleUpdateScore(item)}
      >
        <Text style={styles.updateBtnText}>Update Score ➡</Text>
      </TouchableOpacity>
      
      )}
    </TouchableOpacity>
  );

  const MatchList = ({ status }) => {
    const filteredMatches = matches.filter((match) => match.status === status);

    if (loading) {
      return <ActivityIndicator size="large" color={colors.buttonBackground} style={{ marginTop: 20 }} />;
    }

    return (
      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={<Text style={styles.emptyText}>No matches found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  const MatchDetails = () => {
    if (!selectedMatch) return null;

    return (
      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.matchSummary}>{selectedMatch.result_text || 'Match details unavailable'}</Text>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.primaryGradientEnd },
          tabBarLabelStyle: { color: 'white' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen name="Live" children={() => <MatchList status="live" />} />
        <Tab.Screen name="Upcoming" children={() => <MatchList status="scheduled" />} />
        <Tab.Screen name="Completed" children={() => <MatchList status="completed" />} />
      </Tab.Navigator>
      <MatchDetails />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd, padding: 15 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 5,
  },
  matchTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primaryGradientEnd },
  detailText: { fontSize: 14, color: '#444', marginBottom: 4 },
  statusText: { fontSize: 14, fontWeight: 'bold', color: colors.buttonBackground },
  updateBtnWrapper: {
    backgroundColor: colors.buttonBackground,
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateBtnText: { color: '#fff', fontWeight: '600' },
  detailsContainer: { marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10 },
  matchSummary: { fontSize: 20, color: '#333', fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#aaa' },
});

export default MatchListScreen;
