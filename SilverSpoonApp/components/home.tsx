import React from 'react';
import { View, Image, StyleSheet, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export default function Home() {
  const { token } = useContext(AuthContext);

  if (!token) {
    return null; // Or redirect to SignIn
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/silverspoon.png')} style={styles.image} />
      <TextInput placeholder="Search..." style={styles.search} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  search: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
});