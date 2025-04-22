/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/LoginScreen.tsx
 ************************************************************/

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../src/firebase';

/**
 * LoginScreen Component
 *
 * Handles user login with Firebase Authentication.
 * Allows navigation to the SignUp screen if the user doesn't have an account.
 */
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');  // Stores input email
  const [password, setPassword] = useState('');  // Stores input password

  // Handles login logic and navigates to Profile screen on success
  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('Profile'))
      .catch(error => Alert.alert('Login Error', error.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {/* Email Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Navigation Link to Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don’t have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f5f6fa', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 15, marginBottom: 8, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center' },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 15, color: '#555' },
  linkBold: { color: '#007AFF', fontWeight: '700' },
});

export default LoginScreen;
