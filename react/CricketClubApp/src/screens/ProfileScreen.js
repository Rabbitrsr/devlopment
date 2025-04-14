import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import HttpService from '../services/httpService';
import colors from '../utils/colors';


const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userid');
        if (!storedUserId) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        setUserId(storedUserId);

        const data = await HttpService.get(`${api.GET_USER_DETAILS}/${storedUserId}`);

        setFullName(data.full_name);
        setMobile(data.mobile);
        setEmail(data.email);
        setRole(data.role);
        
      } 
      catch (error) {
        Alert.alert('Error', 'Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim() || !mobile.trim()) {
      Alert.alert('Error', 'Full Name and Mobile are required.');
      return;
    }
  
    try {
      let postdata = {
        full_name: fullName,
        mobile,
      };
  
      // Only include password if the user provides a new one
      if (password && password.trim()) {
        postdata.password = password;
      }
  
      const data = await HttpService.post(`${api.UPDATE_USER}/${userId}`, postdata); // No userId in the request
  
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
      console.error(error);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Mobile</Text>
          <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter new password"
            placeholderTextColor={colors.textWhite}
          />

          <Text style={styles.label}>Email (Non-editable)</Text>
          <TextInput style={styles.inputDisabled} value={email} editable={false} />

          <Text style={styles.label}>Role (Non-editable)</Text>
          <TextInput style={styles.inputDisabled} value={role} editable={false} />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primaryGradientEnd,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: colors.textWhite,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    color: colors.textWhite,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    color: '#888',
  },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
