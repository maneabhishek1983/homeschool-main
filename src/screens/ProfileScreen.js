import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfileScreen() {
  const user = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.uid || 'N/A'}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'Anonymous User'}</Text>
        
        <Text style={styles.label}>Account Type:</Text>
        <Text style={styles.value}>{user?.isAnonymous ? 'Guest' : 'Registered User'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
}); 