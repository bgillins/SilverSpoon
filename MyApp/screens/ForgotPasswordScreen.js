import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../services/api';
import backgroundImage from '../assets/background.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      const lowercaseEmail = email.toLowerCase();
      await api.post('password-reset/', { email: lowercaseEmail });
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      navigation.goBack();
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomButton title="Reset Password" onPress={handleResetPassword} />
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
    marginTop: '10%',
    backgroundColor: 'rgba(255, 255, 255, .10)',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ForgotPasswordScreen;