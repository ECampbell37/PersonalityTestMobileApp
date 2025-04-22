/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /components/CustomHeader.tsx
 ************************************************************/


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


/**
 * Props for CustomHeader
 * - navigation: navigation object to allow screen transitions
 * - route: current screen route info
 * - options: screen-level options (includes optional title)
 * - back (optional): React Navigation prop for back button control
 */
interface CustomHeaderProps {
  navigation: any;
  route: any;
  options: any;
  back?: any;
}


/**
 * CustomHeader Component
 *
 * A reusable top navigation header with:
 * - Left home icon → navigates to 'Welcome'
 * - Title (centered)
 * - Right profile icon → navigates to 'Profile'
 */
const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation, route, options }) => {
  const title = options.title || route.name; // Fallback to route name if no custom title

  return (
    <View style={styles.header}>
      {/* Home button (left side) */}
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.iconButton}>
        <Ionicons name="home-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Screen title (centered) */}
      <Text style={styles.title}>{title}</Text>

      {/* Profile button (right side) */}
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
