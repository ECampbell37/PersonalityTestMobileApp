import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  navigation: any;
  route: any;
  options: any;
  back?: any;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation, route, options }) => {
  const title = options.title || route.name;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.iconButton}>
        <Ionicons name="home-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
        <Ionicons name="person-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10, // Push icons and title down
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  iconButton: {
    width: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CustomHeader;
