/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    App.tsx
 ************************************************************/


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens and Components
import WelcomeScreen from './screens/WelcomeScreen';
import TestScreen from './screens/TestScreen';
import ResultsScreen from './screens/ResultsScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import CustomHeader from './components/CustomHeader';
import TraitInfoScreen from './screens/TraitInfoScreen';

// Create navigation stack
const Stack = createStackNavigator();

/**
 * App Component
 *
 * Sets up the main navigation structure of the app using React Navigation.
 * A custom header is injected into every screen for consistent UI.
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: ({ navigation, route, options, back }) => (
            <CustomHeader navigation={navigation} route={route} options={options} back={back} />
          ),
        }}
      >
        {/* Screen routing definitions */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="Test" component={TestScreen} options={{ title: 'Test' }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="Traits" component={TraitInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
