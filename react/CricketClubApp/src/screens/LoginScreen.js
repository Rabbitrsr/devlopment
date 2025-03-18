import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'; // adjust the import path as per your structure

const LoginScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.heading}>Welcome Back!</Text>
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={colors.iconColor} style={styles.icon} />
          <TextInput placeholder="Email" placeholderTextColor={colors.placeholder} style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color={colors.iconColor} style={styles.icon} />
          <TextInput placeholder="Password" placeholderTextColor={colors.placeholder} secureTextEntry style={styles.input} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.loginBtn}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>New here? Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Forgot Password clicked')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    color: colors.textWhite,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textWhite,
    height: 50,
  },
  loginBtn: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
  },
  loginText: {
    color: colors.textWhite,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: colors.linkText,
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
