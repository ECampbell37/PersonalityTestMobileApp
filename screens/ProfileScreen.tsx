/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/ProfileScreen.tsx
 ************************************************************/

// React and React Native core imports
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';

// Firebase config
import { firebase } from '../src/firebase';

// Icon pack
import { Ionicons } from '@expo/vector-icons';

/**
 * ProfileScreen Component
 *
 * Displays user's profile information (email, display name),
 * allows user to log out or edit display name,
 * and shows a list of previously completed personality tests.
 */
const ProfileScreen = ({ navigation }: any) => {
  // Local state for authenticated user and their test history
  const [user, setUser] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // On component mount: check auth state and subscribe to test history
  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Ensure user info is fully loaded
        await authUser.reload();
        const refreshedUser = firebase.auth().currentUser;

        // Store basic user info in local state
        setUser({
          uid: refreshedUser?.uid,
          email: refreshedUser?.email || 'No Email',
          displayName: refreshedUser?.displayName || '',
        });

        // Subscribe to changes in user's test history
        const unsubscribeTests = firebase
          .firestore()
          .collection('users')
          .doc(refreshedUser?.uid)
          .collection('tests')
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            (snapshot) => {
              const tests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setTestHistory(tests);
              setLoading(false);
            },
            (error) => {
              console.log('Error fetching test history:', error);
              setLoading(false);
            }
          );

        // Cleanup test history listener on unmount
        return () => unsubscribeTests();
      } else {
        // Redirect unauthenticated users to Login screen
        navigation.navigate('Login');
        setLoading(false);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, [navigation]);

  // Sign out the current user and navigate to welcome screen
  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => navigation.navigate('Welcome'))
      .catch((error) => Alert.alert('Logout Error', error.message));
  };

  // Deletes a specific test document for the logged-in user
  const handleDeleteTest = (testId: string) => {
    if (!user) return;

    Alert.alert(
      'Delete Test',
      'Are you sure you want to delete this test result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .collection('tests')
                .doc(testId)
                .delete();

              // Optimistically update state without re-fetching
              setTestHistory((prev) => prev.filter((t) => t.id !== testId));
            } catch (error) {
              console.error('Error deleting test:', error);
              Alert.alert('Error', 'Failed to delete test.');
            }
          },
        },
      ]
    );
  };

  // Prompts the user to edit their display name and updates it in Firebase
  const handleEditName = () => {
    if (!user) return;

    Alert.prompt(
      'Edit Display Name',
      'Enter your new display name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (newName) => {
            if (!newName) return;
            try {
              const currentUser = firebase.auth().currentUser;
              if (currentUser) {
                await currentUser.updateProfile({ displayName: newName });
                await currentUser.reload();

                const refreshedUser = firebase.auth().currentUser;
                setUser({
                  uid: refreshedUser?.uid,
                  email: refreshedUser?.email || 'No Email',
                  displayName: refreshedUser?.displayName || '',
                });
              }
            } catch (error) {
              console.error('Error updating display name:', error);
              Alert.alert('Error', 'Failed to update name.');
            }
          },
        },
      ],
      'plain-text',
      user.displayName || ''
    );
  };

  // Render a test history card with scores and delete button
  const renderTestHistoryItem = ({ item, index }: { item: any; index: number }) => {
    const date = item.createdAt
      ? item.createdAt.toDate().toLocaleDateString()
      : 'N/A';

    const { E, A, C, N, O } = item.scores;

    const traits = [
      { label: 'O', value: O, color: '#9b59b6', emoji: '💡' },
      { label: 'C', value: C, color: '#3498db', emoji: '🛠️' },
      { label: 'E', value: E, color: '#f39c12', emoji: '🥳' },
      { label: 'A', value: A, color: '#2ecc71', emoji: '🤝' },
      { label: 'N', value: N, color: '#e74c3c', emoji: '😥' },
    ];

    return (
      <TouchableOpacity
        style={[styles.testCard, index === 0 && { marginTop: 4 }]}
        onPress={() =>
          navigation.navigate('Results', { testScores: { E, A, C, N, O } })
        }
      >
        {/* Test date and delete button */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={styles.testDate}>📅 {date}</Text>
          <TouchableOpacity onPress={() => handleDeleteTest(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" style={{ marginTop: -4 }} />
          </TouchableOpacity>
        </View>

        {/* Trait scores for the test */}
        <View style={styles.traitBadgeRow}>
          {traits.map((trait) => (
            <View
              key={trait.label}
              style={[styles.traitBadge, { backgroundColor: trait.color + '20' }]}
            >
              <Text style={styles.traitEmoji}>{trait.emoji}</Text>
              <Text style={[styles.traitLabel, { color: trait.color }]}>
                {trait.label}
              </Text>
              <Text style={[styles.traitScore, { color: trait.color }]}>
                {trait.value}%
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  // Renders the header portion of the profile (user info + logout)
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Account Page</Text>

      {user && (
        <View style={styles.profileCard}>
          {/* Profile Icon */}
          <Ionicons name="person-circle-outline" size={60} color="#007AFF" style={{ marginBottom: 10 }} />

          {/* Editable Display Name */}
          <TouchableOpacity
            onPress={handleEditName}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
          >
            <Text style={styles.displayNameText}>
              {user.displayName || 'Enter Your Name!'}
            </Text>
            <Ionicons name="pencil-outline" size={18} color="#007AFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* Email */}
          <Text style={styles.emailLabel}>Signed in as</Text>
          <Text style={styles.emailText}>{user.email}</Text>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Divider and status indicators */}
      <View style={styles.sectionDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>🎉 Your Personality Tests</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Show loading spinner or empty state message */}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
      {!loading && testHistory.length === 0 && (
        <Text style={styles.noHistoryText}>No test history available.</Text>
      )}
    </View>
  );

  // FlatList renders header and test history list
  return (
    <FlatList
      contentContainerStyle={{ ...styles.container, paddingBottom: 10 }}
      data={testHistory}
      keyExtractor={(item) => item.id}
      renderItem={renderTestHistoryItem}
      ListHeaderComponent={ListHeader}
    />
  );
};

// Style definitions for layout and design
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F0F4F8',
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 25,
  },
  displayNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  emailLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerLabel: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#7B8794',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  testDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  traitBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  traitBadge: {
    width: 55,
    aspectRatio: 0.8,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 2,
  },
  traitEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  traitLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  traitScore: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ProfileScreen;
