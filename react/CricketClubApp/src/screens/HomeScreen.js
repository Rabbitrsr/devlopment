import React, { useEffect, useState } from 'react';
import {
  StatusBar, View, Text, StyleSheet,
  TouchableOpacity, ScrollView, Image, Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../utils/colors';
import responsive from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import HttpService from '../services/httpService';
import api from '../services/api';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [livematches, setLiveMatches] = useState([]);

  const bannerImages = [
    require('../assets/images/banner1.png'),
    require('../assets/images/banner1.png'),
    require('../assets/images/banner1.png'),
    require('../assets/images/banner1.png'),
  ];

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const response = await HttpService.get(api.GET_LIVE_MATCHES);
      setLiveMatches(response || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load matches');
    }
  };

  const clubInfo = "We are RCC - A proud cricket club bringing the thrill of cricket to our community.";

  return (
    <LinearGradient colors={[colors.primaryGradientStart, colors.primaryGradientEnd]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>RCC Cricket Club</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../assets/images/rcb.png')} style={styles.profileimage} />
            </TouchableOpacity>
          </View>

          {/* Banner Scroll */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {bannerImages.map((img, index) => (
              <View key={index} style={styles.bannerSlide}>
                <Image source={img} style={styles.bannerImage} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>

          {/* Live Matches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Matches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {livematches.map((match) => (
                <TouchableOpacity
                  key={match.id}
                  style={styles.liveMatchCard}
                  onPress={() => navigation.navigate('MatchDetail', { matchId: match.matchId })}
                >
                  <View style={styles.teamsRow}>
                    <Text style={styles.vsText}>{match.team1.name} vs {match.team2.name}</Text>
                  </View>
                  <Text style={styles.scoreText}>{match.score}</Text>
                  <Text style={styles.statusText}>{match.status}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* About Club */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About The Club</Text>
            <Text style={styles.clubInfoText}>{clubInfo}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsive.verticalScale(15),
    paddingHorizontal: responsive.scale(15),
  },
  headerTitle: {
    color: colors.textWhite,
    fontSize: responsive.responsiveFont(20),
    fontWeight: 'bold',
  },
  profileimage: {
    height: 32,
    width: 32,
  },
  bannerScroll: {
    height: 200,
    marginBottom: 15,
  },
  bannerSlide: {
    width: screenWidth,
    paddingHorizontal: 15,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.textWhite,
    fontSize: 20,
    marginBottom: 10,
  },
  liveMatchCard: {
    width: 180,
    backgroundColor: colors.textPrimary,
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  statusText: {
    color: colors.highlight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  clubInfoText: {
    color: colors.textWhite,
    fontSize: 14,
  },
});

export default HomeScreen;
