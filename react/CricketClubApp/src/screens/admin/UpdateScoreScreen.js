import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Button,
  InteractionManager ,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const UpdateScoreScreen = () => {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState('4.2');
  const [currentOverBalls, setCurrentOverBalls] = useState([]); // holds each ball score
  const [striker, setStriker] = useState({ name: 'Samarth Desai', runs: 22, balls: 13 });
  const [nonStriker, setNonStriker] = useState({ name: 'Harit Manek', runs: 12, balls: 16 });
  const [bowler, setBowler] = useState('Ishir Shah');
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extraType, setExtraType] = useState(null); // either 'BYE' or 'LB'

  const [showWdNbModal, setShowWdNbModal] = useState(false);
  const [extraRuns, setExtraRuns] = useState(0);
  const [wicketOnExtra, setWicketOnExtra] = useState(false);
  const [legalBallsCount, setLegalBallsCount] = useState(0);



  const addBallToOver = (ballOutcome, isLegal = true) => {
    setCurrentOverBalls(prevBalls => [...prevBalls, ballOutcome]);
  
    if (isLegal) {
      setLegalBallsCount(prev => {
        const updatedCount = prev + 1;
        if (updatedCount === 6) {
          const [completedOver] = overs.split('.');
          setOvers(`${parseInt(completedOver) + 1}.0`);
          // Clear current over balls after completing over
          setCurrentOverBalls([]);
          return 0;
        } else {
          const [completedOver] = overs.split('.');
          setOvers(`${completedOver}.${updatedCount}`);
          return updatedCount;
        }
      });
    }
  };

  const CustomCheckbox = ({ value, onChange }) => (
    <TouchableOpacity
      onPress={onChange}
      style={{
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: value ? '#4caf50' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
      }}
    >
      {value && <Text style={{ color: '#fff' }}>✓</Text>}
    </TouchableOpacity>
  );
  

  const handleRun = (run) => {
    setRuns(runs + run);
    if (run % 2 !== 0) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }
    addBallToOver(run.toString());
  };

  const handleExtras = (type) => {
    setRuns(runs + 1);
    addBallToOver(type);
  };

  const handleByeOrLb = (type) => {
    setExtraType(type);
    setShowExtrasModal(true);
  };

  const handleWicket = () => {
    setShowWicketModal(true);
    addBallToOver('W');
  };

  const handleWideOrNoBall = (type) => {
    setExtraType(type);
    setExtraRuns(0);
    setWicketOnExtra(false);
    setShowWdNbModal(true);
  };
  
  const saveWideOrNoBall = () => {
    const totalExtra = 1 + extraRuns;
    setRuns(prev => prev + totalExtra);
    addBallToOver(`${extraType}+${extraRuns}`, false);
  
    setShowWdNbModal(false);
  
    if (wicketOnExtra) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          setShowWicketModal(true);
        }, 400); // wait for modal to fully close
      });
    }
  };
  

  const endInnings = () => {
    alert('Innings Ended!');
  };

  const updateButtons = [
    { label: '0', action: () => handleRun(0) },
    { label: '1', action: () => handleRun(1) },
    { label: '2', action: () => handleRun(2) },
    { label: '3', action: () => handleRun(3) },
    { label: '4', action: () => handleRun(4) },
    { label: '6', action: () => handleRun(6) },
    { label: 'WD', action: () => handleWideOrNoBall('WD') },
    { label: 'NB', action: () => handleWideOrNoBall('NB') },
    { label: 'LB', action: () => handleByeOrLb('LB') },
    { label: 'BYE', action: () => handleByeOrLb('BYE') },
    { label: 'OUT', action: handleWicket },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.header}>
          <Text style={styles.matchTitle}>SVCC Lions</Text>
          <Text style={styles.score}>
            {runs}/{wickets} ({overs})
          </Text>
          <View style={styles.playersRow}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>⚫ {striker.name}</Text>
              <Text style={styles.playerStats}>
                {striker.runs} ({striker.balls})
              </Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>🟠 {nonStriker.name}</Text>
              <Text style={styles.playerStats}>
                {nonStriker.runs} ({nonStriker.balls})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bowlerRow}>
          <Text style={styles.bowlerName}>🎾 {bowler}</Text>
        </View>

        <View style={styles.currentOverContainer}>
          <Text style={styles.currentOverTitle}>Current Over</Text>
          <View style={styles.currentOverBalls}>
            {currentOverBalls.map((ball, idx) => (
              <View key={idx} style={styles.ballCircle}>
                <Text style={styles.ballText}>{ball}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.gridContainer}>
          {updateButtons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.gridButton,
                item.label === 'OUT' && { backgroundColor: '#EF4444' },
              ]}
              onPress={item.action}
            >
              <Text style={styles.gridButtonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.endButton} onPress={endInnings}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Finish Innings</Text>
        </TouchableOpacity>

        <Modal visible={showWicketModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Select New Batsman
              </Text>
              <FlatList
                data={[
                  { name: 'Player 1' },
                  { name: 'Player 2' },
                  { name: 'Player 3' },
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                        setNonStriker({ name: item.name, runs: 0, balls: 0 });
                        setShowWicketModal(false);
                        setWickets((prev) => prev + 1);
                      }}
                      
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </Modal>

        <Modal visible={showExtrasModal} transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        How many runs from {extraType}?
      </Text>
      {[0, 1, 2, 3, 4].map((num) => (
        <TouchableOpacity
          key={num}
          style={{ padding: 10 }}
          onPress={() => {
            setRuns(runs + num);
            addBallToOver(extraType === 'BYE' ? `B${num}` : `LB${num}`, true);
            setShowExtrasModal(false);
          }}
        >
          <Text style={{ fontSize: 18 }}>{num} run(s)</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
</Modal>

<Modal visible={showWdNbModal} transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        Runs taken on {extraType}?
      </Text>
      {[0, 1, 2, 3, 4,6].map((num) => (
        <TouchableOpacity
          key={num}
          style={{ padding: 10 }}
          onPress={() => setExtraRuns(num)}
        >
          <Text style={{ fontSize: 18 }}>{num} run(s)</Text>
        </TouchableOpacity>
      ))}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <CustomCheckbox
            value={wicketOnExtra}
            onChange={() => setWicketOnExtra((prev) => !prev)}
          />
        <Text style={{ marginLeft: 8 }}>Wicket (run-out)?</Text>
      </View>
      <Button title="Save" onPress={saveWideOrNoBall} />
    </View>
  </View>
</Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#111827',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  matchTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  playersRow: { flexDirection: 'row', justifyContent: 'space-around' },
  playerInfo: { alignItems: 'center' },
  playerName: { color: 'white', fontWeight: 'bold' },
  playerStats: { color: '#D1D5DB' },
  bowlerRow: { marginTop: 10, alignItems: 'center' },
  bowlerName: { fontSize: 16, color: '#374151' },
  currentOverContainer: { marginTop: 30, paddingHorizontal: 20 },
  currentOverTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  currentOverBalls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  ballCircle: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  ballText: { fontWeight: 'bold', color: '#111827' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
    justifyContent: 'center',
  },
  gridButton: {
    width: '28%',
    aspectRatio: 1,
    margin: '2%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  gridButtonText: { fontWeight: 'bold', fontSize: 18 },
  endButton: {
    backgroundColor: '#111827',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 30,
    padding: 20,
    borderRadius: 10,
    maxHeight: 400,
  },
});

export default UpdateScoreScreen;
