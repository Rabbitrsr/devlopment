import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import HttpService from '../services/httpService';
import api from '../services/api';
import colors from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const PlayerListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const teamId = route.params?.teamId;
  const teamName = route.params?.teamName;
  const userRole = route.params?.userRole || 'admin'; // fallback for admin testing

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await HttpService.get(`${api.GET_PLAYERS}/${teamId}`);
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useFocusEffect(
    useCallback(() => {
      if (teamId) {
        fetchPlayers();
      }
    }, [fetchPlayers, teamId])
  );

  const handleDeletePlayer = (playerId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this player?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await HttpService.delete(`${api.DELETE_PLAYER}/${playerId}`);
            fetchPlayers();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const renderPlayer = ({ item }) => (
    <TouchableOpacity
      style={styles.playerCard}
      onPress={() =>
        navigation.navigate('AddPlayer', {
          playerData: item,
          teamId: item.team_id,
          teamName: teamName,
        })
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {item.photo_url ? (
          <Image source={{ uri: api.API_BASE_URL + item.photo_url }} style={styles.playerImage} />
        ) : (
          <View style={[styles.playerImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text>IMG</Text>
          </View>
        )}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.playerName}>{item.player_name}</Text>
          <Text style={styles.playerRole}>{item.role}</Text>
        </View>
      </View>
      {userRole === 'admin' && (
        <TouchableOpacity onPress={() => handleDeletePlayer(item.id)}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <Text style={styles.teamHeading}>{teamName} - Players</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlayer}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddPlayer', { teamId, teamName })}
        >
          <Icon name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryGradientEnd },
  teamHeading: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
  },
  playerCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  playerImage: { width: 50, height: 50, borderRadius: 25 },
  playerName: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
  playerRole: { color: colors.textSecondary, marginTop: 4 },
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
});

export default PlayerListScreen;
