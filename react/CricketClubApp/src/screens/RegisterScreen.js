import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors'; // adjust path based on your folder structure

const RegisterScreen = ({ navigation }) => {
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
            <TextInput placeholder="Full Name" placeholderTextColor={colors.placeholder} style={styles.input} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput placeholder="Email" placeholderTextColor={colors.placeholder} style={styles.input} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput placeholder="Mobile Number" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" style={styles.input} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <TextInput placeholder="Password" placeholderTextColor={colors.placeholder} secureTextEntry style={styles.input} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.registerBtn}
          >
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
