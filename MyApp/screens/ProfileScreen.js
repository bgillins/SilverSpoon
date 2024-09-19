// screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await api.get('me/');
      setUser(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      Alert.alert('Success', 'Logged out successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditProfile', { user, fetchUser });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.profile_picture ? (
        <Image source={{ uri: user.profile_picture }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>{user.bio}</Text>
      <Text style={styles.sectionTitle}>Disliked Ingredients:</Text>
      <Text>{user.disliked_ingredients || 'None'}</Text>
      <Text style={styles.sectionTitle}>Badges:</Text>
      {user.badges && user.badges.length > 0 ? (
        user.badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            {badge.icon ? (
              <Image source={{ uri: badge.icon }} style={styles.badgeIcon} />
            ) : (
              <View style={styles.badgePlaceholder}>
                <Text>No Icon</Text>
              </View>
            )}
            <Text>{badge.name}</Text>
          </View>
        ))
      ) : (
        <Text>No badges earned yet.</Text>
      )}
      <Text style={styles.sectionTitle}>Preferences:</Text>
      <Text>{JSON.stringify(user.preferences)}</Text>
      <Text style={styles.sectionTitle}>Consent to Ads:</Text>
      <Text>{user.consent_to_ads ? 'Yes' : 'No'}</Text>
      <Button title="Edit Profile" onPress={handleEdit} />
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    marginTop: 15,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  bio: {
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  badgePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
