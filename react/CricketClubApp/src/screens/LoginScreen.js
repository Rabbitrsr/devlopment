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
import colors from '../utils/colors'; // adjust path if needed

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    const tempErrors = {};

    if (!email.trim()) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Enter a valid email';
      valid = false;
    }

    if (!password.trim()) {
      tempErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };


  const handleLogin = () => {
    if (validate()) {
      // Example: You might get role from backend, using dummy logic for now:
      const userRole = email === 'admin@rcc.com' ? 'admin' : 'user';
    
      if (userRole === 'admin') {
        navigation.replace('AdminTabs'); // navigate to admin stack
      } else {
        navigation.replace('MainTabs');  // navigate to user bottom tabs
      }
    }
  };
  
  

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.heading}>Welcome to RCC🏏</Text>

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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color={colors.iconColor} style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>New here? Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, padding: 24, justifyContent: 'center' },
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
