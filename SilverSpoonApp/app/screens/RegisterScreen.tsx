import React from 'react';
import { View } from 'react-native';
import { Register } from '@/components/Register';

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Register />
    </View>
  );
}
