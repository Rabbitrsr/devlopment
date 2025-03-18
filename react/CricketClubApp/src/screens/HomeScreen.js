import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';
import colors from '../utils/colors';

const bannerData = [
  { id: 1, image: require('../assets/images/banner1.png') },
  { id: 1, image: require('../assets/images/banner1.png') },
  { id: 1, image: require('../assets/images/banner1.png') },
];

const BannerCarousel = () => (
  <Carousel
    data={bannerData}
    renderItem={({ item }) => (
      <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
    )}
    sliderWidth={400}
    itemWidth={350}
    autoplay
    loop
  />
);

const LiveMatchesSection = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Live Matches</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.liveCard}>
          <Text style={styles.liveCardText}>Match {item}</Text>
          <Text style={styles.liveCardSubText}>MI vs RCB - Live</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const ClubInfoSection = () => (
  <View style={styles.clubInfoContainer}>
    <Text style={styles.sectionTitle}>About The Club</Text>
    <Text style={styles.clubInfoText}>
      RCC is a premier cricket club known for nurturing talent and hosting exciting matches.
    </Text>
  </View>
);

const HomeScreen = () => (
  <LinearGradient
    colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
    style={styles.container}
  >
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RCC Club</Text>
        <TouchableOpacity>
          <Icon name="person-circle-outline" size={30} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      <BannerCarousel />
      <LiveMatchesSection />
      <ClubInfoSection />
    </ScrollView>
  </LinearGradient>
);

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Scorecard') iconName = 'stats-chart-outline';
          else if (route.name === 'Schedule') iconName = 'calendar-outline';
          else if (route.name === 'Events') iconName = 'trophy-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.buttonBackground,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scorecard" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={HomeScreen} />
      <Tab.Screen name="Events" component={HomeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  bannerImage: {
    height: 180,
    borderRadius: 12,
    marginVertical: 10,
  },
  sectionContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.textWhite,
    marginBottom: 10,
  },
  liveCard: {
    width: 150,
    height: 80,
    backgroundColor: '#fff3',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  liveCardSubText: {
    color: '#ddd',
    fontSize: 12,
  },
  clubInfoContainer: {
    paddingHorizontal: 15,
    marginBottom: 40,
  },
  clubInfoText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
});
