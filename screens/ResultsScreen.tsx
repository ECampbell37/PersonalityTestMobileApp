/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/ResultsScreen.tsx
 ************************************************************/


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { firebase } from '../src/firebase';


/**
 * ResultsScreen Component
 *
 * Displays the user's Big Five personality trait results.
 * Normalizes raw scores, shows bars and colors per trait, and stores result in Firestore if new.
 *
 * Props:
 * - route.params.answers: list of 50 integer answers from the test (1–5 scale)
 * - route.params.testScores (optional): pre-computed scores for each trait
 */
const ResultsScreen = ({ route, navigation }: any) => {
  const { answers, testScores } = route.params || {};
  const [scores, setScores] = useState({ E: 0, A: 0, C: 0, N: 0, O: 0 }); // Final trait scores (percentages)
  const [stored, setStored] = useState(false); // Prevents saving to Firebase multiple times

  useEffect(() => {
    if (testScores) {
      // If scores were passed directly (from account page), use them
      setScores(testScores);
    } else if (answers) {
      // Otherwise, calculate raw trait scores from specific question indices
      const E_raw = 20 + answers[0] - answers[5] + answers[10] - answers[15] + answers[20] - answers[25] + answers[30] - answers[35] + answers[40] - answers[45];
      const A_raw = 14 - answers[1] + answers[6] - answers[11] + answers[16] - answers[21] + answers[26] - answers[31] + answers[36] + answers[41] + answers[46];
      const C_raw = 14 + answers[2] - answers[7] + answers[12] - answers[17] + answers[22] - answers[27] + answers[32] - answers[37] + answers[42] + answers[47];
      const N_raw = 2 + answers[3] - answers[8] + answers[13] - answers[18] + answers[23] + answers[28] + answers[33] + answers[38] + answers[43] + answers[48];
      const O_raw = 8 + answers[4] - answers[9] + answers[14] - answers[19] + answers[24] - answers[29] + answers[34] + answers[39] + answers[44] + answers[49];

      // Normalize scores to percentages
      const normalize = (score: number) => (score / 40) * 100;

      const E = Math.round(normalize(E_raw));
      const A = Math.round(normalize(A_raw));
      const C = Math.round(normalize(C_raw));
      const N = Math.round(normalize(N_raw));
      const O = Math.round(normalize(O_raw));

      setScores({ E, A, C, N, O });

      // Store in Firestore under user’s document
      if (!stored) {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          firebase.firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('tests')
            .add({
              scores: { E, A, C, N, O },
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => setStored(true))
            .catch((error) => console.log('Error storing test history:', error));
        }
      }
    }
  }, [answers, testScores, stored]);


  // Map each trait to label, emoji, color, description, and score
  const traitMap = [
    {
      label: 'Openness',
      value: scores.O,
      emoji: '💡',
      color: '#9b59b6',
      description: 'Creativity, curiosity, and open-mindedness.',
    },
    {
      label: 'Conscientiousness',
      value: scores.C,
      emoji: '🛠️',
      color: '#3498db',
      description: 'Organization, responsibility, and dependability.',
    },
    {
      label: 'Extraversion',
      value: scores.E,
      emoji: '🥳',
      color: '#f39c12',
      description: 'Sociability, assertiveness, and energy.',
    },
    {
      label: 'Agreeableness',
      value: scores.A,
      emoji: '🤝',
      color: '#2ecc71',
      description: 'Compassion, cooperation, and kindness.',
    },
    {
      label: 'Neuroticism',
      value: scores.N,
      emoji: '😥',
      color: '#e74c3c',
      description: 'Emotional reactivity and sensitivity to stress.',
    },
  ];

  // Determine strongest trait by furthest distance from 50
  const strongestTrait = traitMap.reduce((prev, curr) => {
    const prevStrength = Math.abs(prev.value - 50);
    const currStrength = Math.abs(curr.value - 50);
    return currStrength > prevStrength ? curr : prev;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Results</Text>

      {/* Highlighted summary of strongest trait */}
      <View style={styles.highlightBox}>
        <Text style={styles.highlightText}>
          🧭 Your strongest trait is{' '}
          <Text style={{ color: strongestTrait.color }}>
            {strongestTrait.emoji} {strongestTrait.label}
          </Text>{' '}
          at {strongestTrait.value}%!
        </Text>
      </View>

      {/* Bar chart for each trait */}
      <View style={styles.traitChart}>
        {traitMap.map((trait) => (
          <View key={trait.label} style={styles.traitRow}>
            <View style={styles.traitHeader}>
              <Text style={styles.traitLabel}>
                {trait.emoji} {trait.label}
              </Text>
              <Text style={[styles.traitValue, { color: trait.color }]}>
                {trait.value}%
              </Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${trait.value}%`,
                    backgroundColor: trait.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.traitDescription}>{trait.description}</Text>
          </View>
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.traitButton]}
          onPress={() => navigation.navigate('Traits')}
          activeOpacity={0.85}
        >
          <Text style={styles.traitButtonText}>📖 Learn About the Traits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.buttonText}>🏠 Return Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f6fa',
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  highlightBox: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  traitChart: {
    width: '100%',
  },
  traitRow: {
    marginBottom: 24,
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  traitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  traitValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  barBackground: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  traitDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
  },
  buttonRow: {
    width: '100%',
    marginTop: 30,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  traitButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  traitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryButton: {
    backgroundColor: '#2D3436',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsScreen;
