import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OccupationalActivities() {
  const activities = [
    { id: '1', title: 'Life Skills', description: 'Basic daily living skills and routines' },
    { id: '2', title: 'Social Skills', description: 'Communication and interaction practice' },
    { id: '3', title: 'Fine Motor Skills', description: 'Hand-eye coordination activities' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Occupational Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDescription}>{item.description}</Text>
          </View>
        )}
      />
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
  activityCard: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 16,
    color: '#666',
  },
});
