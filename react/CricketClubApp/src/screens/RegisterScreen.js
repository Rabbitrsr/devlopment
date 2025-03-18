import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'; // adjust path based on your folder structure

const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mobNo, setMobNo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = 'Full name is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email';
      valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!mobNo.trim()) {
      newErrors.mobNo = 'Mobile number is required';
      valid = false;
    } else if (!phoneRegex.test(mobNo)) {
      newErrors.mobNo = 'Enter a valid 10-digit mobile number';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = () => {
    if (validate()) {
      Alert.alert('Success', 'Account created successfully!');
      // You can proceed with API call or navigation here
      navigation.navigate('Login');
    }
  };

  return (
    <LinearGradient
      colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
          {errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              style={styles.input}
              value={mobNo}
              onChangeText={setMobNo}
            />
          </View>
          {errors.mobNo && <Text style={styles.errorText}>{errors.mobNo}</Text>}

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

          <TouchableOpacity onPress={handleRegister} style={styles.registerBtn}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
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
    fontSize: 30,
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
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.textWhite,
    height: 50,
  },
  errorText: {
    color: 'yellow',
    marginBottom: 10,
    marginLeft: 5,
  },
  registerBtn: {
    backgroundColor: colors.buttonBackground,
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
  },
  registerText: {
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

export default RegisterScreen;
