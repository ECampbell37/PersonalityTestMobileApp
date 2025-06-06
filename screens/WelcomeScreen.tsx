/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/WelcomeScreen.tsx
 ************************************************************/

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';


/**
 * WelcomeScreen Component
 *
 * Displays the main screen of the app.
 * Introduces the test, shows a visual banner, and offers navigation to the test or sign-up.
 *
 * Props:
 * - navigation: navigation object provided by React Navigation
 */
const WelcomeScreen = ({ navigation }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero image banner */}
      <Image source={require('../assets/hero.jpg')} style={styles.heroImage} resizeMode="cover" />

      {/* App title */}
      <Text style={styles.title}>Discover Your True Self</Text>

      {/* Description and app purpose */}
      <Text style={styles.description}>
        Welcome to your own personalized personality app! Unlock the secrets of your personality and uncover what makes you uniquely you.
        Take a fun and insightful quiz to explore your inner world — and track your growth over time!
      </Text>

      {/* Call-to-action button to begin the personality test */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => navigation.navigate('Test', { page: 1, answers: [] })}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>📝 Take the Test</Text>
      </TouchableOpacity>

      {/* Signup prompt for account creation */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupPrompt}>Want to save your results?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Create an account →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 8,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signupContainer: {
    alignItems: 'center',
  },
  signupPrompt: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
