import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uid, token } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      await api.post('password-reset-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      Alert.alert('Success', 'Password has been reset successfully.');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <CustomInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <CustomButton title="Reset Password" onPress={handleResetPassword} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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

export default ResetPasswordScreen;