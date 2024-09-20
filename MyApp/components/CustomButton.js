import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, disabled = false }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomButton;