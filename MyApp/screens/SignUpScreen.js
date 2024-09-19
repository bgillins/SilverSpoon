// screens/SignUpScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/api';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    console.log('Attempting to sign up with:', username, email); // Debugging

    try {
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
      });
      console.log('Sign up successful:', response.data); // Debugging

      // Navigate to SignIn screen after successful registration
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Sign up error:', error.response); // Debugging
      setErrorMsg('Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        testID="usernameInput"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        testID="emailInput"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="passwordInput"
      />
      <Button title="Sign Up" onPress={handleSignUp} testID="signUpButton" />
      <Button
        title="Already have an account? Sign In"
        onPress={() => navigation.navigate('SignIn')}
        testID="navigateToSignInButton"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 8,
    borderBottomWidth: 1,
    padding: 8,
  },
  error: {
    color: 'red',
  },
});
