import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.png'; // Import the background image

const RegisterScreen = ({ navigation }) => {
  // State variables
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await api.post('users/', {
        email,
        username,
        password,
      });
      Alert.alert('Success', 'User registered successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={backgroundImage} // Use the imported image
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"  // Light grey placeholder
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {/* Custom button for Register */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
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
  link: {
    marginTop: 15,
    color: '#fff', // Change the link color to white for better visibility
    textAlign: 'center', 
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
});

export default RegisterScreen;
