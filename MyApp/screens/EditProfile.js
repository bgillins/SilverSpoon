import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import api from '../services/api';

const EditProfile = ({ route, navigation }) => {
  const { user, fetchUser } = route.params;
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [dislikedIngredients, setDislikedIngredients] = useState(user.disliked_ingredients);
  const [preferences, setPreferences] = useState(JSON.stringify(user.preferences));

  const handleSave = async () => {
    try {
      const updatedData = {
        username,
        bio,
        disliked_ingredients: dislikedIngredients,
        preferences: JSON.parse(preferences),
      };
      await api.put(`users/${user.id}/`, updatedData);
      Alert.alert('Success', 'Profile updated successfully!');
      fetchUser();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Username:</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text>Bio:</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Text>Disliked Ingredients (comma separated):</Text>
      <TextInput
        style={styles.input}
        value={dislikedIngredients}
        onChangeText={setDislikedIngredients}
      />

      <Text>Preferences (JSON format):</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={preferences}
        onChangeText={setPreferences}
        multiline
      />

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
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
    borderRadius: 5,
    marginBottom: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfile;