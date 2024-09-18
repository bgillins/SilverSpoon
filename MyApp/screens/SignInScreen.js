// screens/SignInScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../services/api';

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    console.log('Attempting to sign in with:', username, password); // Debugging statement

    try {
      const response = await api.post('/auth/login/', {
        username,
        password,
      });
      console.log('Sign in successful:', response.data); // Debugging statement
      // Navigate to Home screen
      navigation.navigate('Home');
    } catch (error) {
      console.log('Sign in error:', error.response); // Debugging statement
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="passwordInput"
      />
      <Button title="Sign In" onPress={handleSignIn} testID="signInButton" />
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
