import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post('token/', {
        email,
        password,
      });
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
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('password-reset/', { email });
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      setPassword(''); // Clear password field after reset request
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Don't have an account? Register
          </Text>
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
    borderColor: '#999', // Slightly darker border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for input fields
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
    color: '#fff', // White color for the link text
    textAlign: 'center',
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