import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('token/', { email, password });
      const { access, refresh } = response.data;
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomButton title="Login" onPress={handleLogin} />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: '10%', // Move content up to roughly 1/3 of the screen height
    backgroundColor: 'rgba(255, 255, 255, .10)', // Transparent background
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff', // White color for the title
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff', // White text for input
  },
  button: {
    backgroundColor: '#000', // Black button background
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff', // White text for the button
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: '#ffffff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;