import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api, { testConnection } from '../services/api'; // Ensure the path is correct

console.log('Imported api:', api);
console.log('Imported testConnection:', testConnection);

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    testConnection().then(isConnected => {
      if (!isConnected) {
        setErrorMsg('Unable to connect to the server. Please check your connection.');
      }
    });
  }, []);

  const handleSignIn = async () => {
    console.log('Attempting to sign in with:', username);

    if (!api) {
      console.error('API is not defined');
      setErrorMsg('Internal error. Please try again later.');
      return;
    }

    if (!api.defaults || !api.defaults.baseURL) {
      console.error('API defaults are not defined');
      setErrorMsg('Internal configuration error.');
      return;
    }

    try {
      console.log('API URL:', `${api.defaults.baseURL}/token/`);
      const response = await api.post('/token/', {
        username,
        password,
      });
      console.log('Sign in successful:', response.data);
      // Handle successful login (e.g., store token, navigate)
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error object:', error);
      if (error.response) {
        console.log('Error response:', error.response);
        console.log('Error response data:', error.response.data);
        setErrorMsg(error.response.data.detail || 'Invalid username or password');
      } else if (error.request) {
        console.log('Error request:', error.request);
        setErrorMsg('No response from server. Please check your connection.');
      } else {
        console.log('Error message:', error.message);
        setErrorMsg('An unexpected error occurred.');
      }
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
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('SignUp')}
        testID="navigateToSignUpButton"
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