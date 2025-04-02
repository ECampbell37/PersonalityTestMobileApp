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
import { firebase } from '../src/firebase';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const unsubscribeTests = firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
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
        return () => unsubscribeTests();
      } else {
        navigation.navigate('Login');
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [navigation]);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => navigation.navigate('Welcome'))
      .catch((error) => Alert.alert('Logout Error', error.message));
  };

  const renderTestHistoryItem = ({ item, index }: { item: any; index: number }) => {
    const date = item.createdAt
      ? item.createdAt.toDate().toLocaleDateString()
      : 'N/A';
    const { E, A, C, N, O } = item.scores;

    const traits = [
      { label: 'O', value: O, color: '#9b59b6', emoji: '💡' }, // Openness
      { label: 'C', value: C, color: '#3498db', emoji: '🛠️' }, // Conscientiousness
      { label: 'E', value: E, color: '#f39c12', emoji: '🥳' }, // Extraversion
      { label: 'A', value: A, color: '#2ecc71', emoji: '🤝' }, // Agreeableness
      { label: 'N', value: N, color: '#e74c3c', emoji: '😥' }, // Neuroticism
    ];

    return (
      <TouchableOpacity
        style={[styles.testCard, index === 0 && { marginTop: 4 }]}
        onPress={() =>
          navigation.navigate('Results', { testScores: { E, A, C, N, O } })
        }
      >
        <Text style={styles.testDate}>📅 {date}</Text>
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

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Account Page</Text>

      {user && (
        <View style={styles.profileCard}>
          <Ionicons
            name="person-circle-outline"
            size={60}
            color="#007AFF"
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.emailLabel}>Signed in as</Text>
          <Text style={styles.emailText}>{user.email}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.sectionDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>🎉 Your Personality Tests</Text>
        <View style={styles.dividerLine} />
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      )}
      {!loading && testHistory.length === 0 && (
        <Text style={styles.noHistoryText}>No test history available.</Text>
      )}
    </View>
  );

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
  emailLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
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
    flexWrap: 'nowrap', // force one line
  },
  traitBadge: {
    width: 55,
    aspectRatio: .8,
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
