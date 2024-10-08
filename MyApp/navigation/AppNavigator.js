import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen'; // Corrected import
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Added ProfileScreen
import EditProfile from '../screens/EditProfile'; // Added EditProfile
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; // Added ForgotPasswordScreen

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> {/* Added ProfileScreen */}
        <Stack.Screen name="EditProfile" component={EditProfile} /> {/* Added EditProfile */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
