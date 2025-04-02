import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../src/firebase';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('Profile'))
      .catch(error => Alert.alert('Login Error', error.message));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

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
