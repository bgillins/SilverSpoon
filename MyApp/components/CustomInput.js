import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default' }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#ccc"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    autoCapitalize="none"
    keyboardType={keyboardType}
  />
);

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
});

export default CustomInput;