import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { login, register } from '@/services/api';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';

export const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      setToken(data.access);
      router.replace('/screens/HomeScreen');
      alert('Logged in successfully');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Login failed');
    }
  };

  const handleRegisterNavigation = () => {
    router.push('/screens/RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Sign In" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={handleRegisterNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});