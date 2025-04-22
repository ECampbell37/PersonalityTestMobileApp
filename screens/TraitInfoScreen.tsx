/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/TraitInfoScreen.tsx
 ************************************************************/

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

/**
 * List of Big Five personality traits with descriptions
 * - label: trait name
 * - emoji: icon for visual flair
 * - color: trait's theme color
 * - description: one-line summary
 * - high: what high scores indicate
 * - low: what low scores indicate
 */
const traits = [
  {
    label: 'Openness',
    emoji: '💡',
    color: '#9b59b6',
    description: 'Creativity, curiosity, and open-mindedness.',
    high: 'High scorers are imaginative, curious, and open to new experiences.',
    low: 'Low scorers prefer tradition, routine, and familiarity.',
  },
  {
    label: 'Conscientiousness',
    emoji: '🛠️',
    color: '#3498db',
    description: 'Organization, responsibility, and dependability.',
    high: 'High scorers are disciplined, organized, and goal-oriented.',
    low: 'Low scorers may be spontaneous, flexible, and sometimes careless.',
  },
  {
    label: 'Extraversion',
    emoji: '🥳',
    color: '#f39c12',
    description: 'Sociability, assertiveness, and energy.',
    high: 'High scorers are outgoing, talkative, and thrive in social settings.',
    low: 'Low scorers (introverts) are reserved, reflective, and enjoy solitude.',
  },
  {
    label: 'Agreeableness',
    emoji: '🤝',
    color: '#2ecc71',
    description: 'Compassion, cooperation, and kindness.',
    high: 'High scorers are empathetic, cooperative, and value harmony.',
    low: 'Low scorers may be skeptical, competitive, or blunt.',
  },
  {
    label: 'Neuroticism',
    emoji: '😥',
    color: '#e74c3c',
    description: 'Emotional reactivity and sensitivity to stress.',
    high: 'High scorers are more prone to stress, worry, and mood swings.',
    low: 'Low scorers are calm, emotionally stable, and resilient.',
  },
];


/**
 * TraitInfoScreen Component
 *
 * Displays detailed descriptions for each of the Big Five traits.
 * Used to educate users after completing the test.
 */
const TraitInfoScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>About the Big Five Traits</Text>

      {/* Render a card for each personality trait */}
      {traits.map((trait) => (
        <View key={trait.label} style={styles.traitCard}>
          <Text style={[styles.traitTitle, { color: trait.color }]}>
            {trait.emoji} {trait.label}
          </Text>
          <Text style={styles.description}>{trait.description}</Text>
          <Text style={styles.subHeading}>High Scorers:</Text>
          <Text style={styles.detail}>{trait.high}</Text>
          <Text style={styles.subHeading}>Low Scorers:</Text>
          <Text style={styles.detail}>{trait.low}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f6fa',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  traitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  traitTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  subHeading: {
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
});

export default TraitInfoScreen;
