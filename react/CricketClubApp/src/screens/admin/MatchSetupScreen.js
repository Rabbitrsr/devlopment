import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Button,  
    FlatList, 
    TouchableOpacity ,  
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api'; // your api file
import HttpService from '../../services/httpService';

const MatchSetupScreen = ({ route, navigation }) => {
  const { matchId } = route.params;

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [tossWinner, setTossWinner] = useState(null);
  const [tossDecision, setTossDecision] = useState('bat');
  const [team1XI, setTeam1XI] = useState([]);
  const [team2XI, setTeam2XI] = useState([]);

  const fetchMatchTeams = async () => {
    const res = await HttpService.get(`${api.GET_MATCHES_FROM_ID}/${matchId}`);
    const match = res.match;
    setTeam1(match.team1);
    setTeam2(match.team2);
    await fetchMatchPlayers(match.team1, match.team2);
  };

  const fetchMatchPlayers = async (team1Id, team2Id) => {
    const playersRes1 = await HttpService.get(`${api.GET_PLAYERS}/${team1Id}`);
    const playersRes2 = await HttpService.get(`${api.GET_PLAYERS}?/${team2Id}`);
  
    const team1Players = playersRes1.players;
    const team2Players = playersRes2.players;
  
    setPlayers([...team1Players, ...team2Players]);
  };  
  

  useEffect(() => {
    fetchMatchTeams();
    fetchMatchPlayers();
  }, []);

  const togglePlayer = (playerId, team, selectedList, setList) => {
    if (selectedList.includes(playerId)) {
      setList(selectedList.filter(id => id !== playerId));
    } else if (selectedList.length < 11) {
      setList([...selectedList, playerId]);
    }
  };

  const submitSetup = async () => {
    const battingTeamId = tossDecision === 'bat' ? tossWinner : (tossWinner === team1 ? team2 : team1);
    const bowlingTeamId = tossDecision === 'bowl' ? tossWinner : (tossWinner === team1 ? team2 : team1);

    const payload = {
      matchId,
      toss: {
        teamId: tossWinner,
        decision: tossDecision,
      },
      battingTeamId,
      bowlingTeamId,
      team1XI,
      team2XI,
    };

    await HttpService.post(api.SETUP_MATCH, payload);
    navigation.navigate('UpdateScoreScreen', { matchId });
  };

  const renderPlayers = (teamId, selectedList, setList) => (
    <FlatList
      data={players.filter(p => p.teamId === teamId)}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => togglePlayer(item._id, teamId, selectedList, setList)}
          style={{ backgroundColor: selectedList.includes(item._id) ? '#aaf' : '#fff', padding: 10, margin: 2 }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18 }}>Toss Winner</Text>
      <Picker selectedValue={tossWinner} onValueChange={setTossWinner}>
        <Picker.Item label="Select Team" value={null} />
        {teams.map(team => (
          <Picker.Item key={team._id} label={team.name} value={team._id} />
        ))}
      </Picker>

      <Text style={{ fontSize: 18 }}>Decision</Text>
      <Picker selectedValue={tossDecision} onValueChange={setTossDecision}>
        <Picker.Item label="Bat" value="bat" />
        <Picker.Item label="Bowl" value="bowl" />
      </Picker>

      <Text style={{ fontSize: 18 }}>Select Playing XI for {team1}</Text>
      {renderPlayers(team1, team1XI, setTeam1XI)}

      <Text style={{ fontSize: 18 }}>Select Playing XI for {team2}</Text>
      {renderPlayers(team2, team2XI, setTeam2XI)}

      <Button title="Submit Match Setup" onPress={submitSetup} disabled={team1XI.length !== 11 || team2XI.length !== 11} />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
})

export default MatchSetupScreen;
