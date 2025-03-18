import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'; // adjust import if needed

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleReset = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    Alert.alert('Success', 'Password reset link sent to your email!');
    // Optionally navigate back or reset the form
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.heading}>Forgot Password</Text>
        <Text style={styles.subHeading}>
          Enter your email and we’ll send you a reset link.
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={colors.iconColor} style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, padding: 24, justifyContent: 'center' },
  heading: {
    fontSize: 30,
    color: colors.textWhite,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    color: colors.textWhite,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: colors.textWhite, height: 50 },
  errorText: {
    color: 'yellow',
    marginBottom: 10,
    marginLeft: 5,
  },
  resetBtn: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
  },
  resetText: {
    color: colors.textWhite,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: colors.linkText,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default ForgetPasswordScreen;
