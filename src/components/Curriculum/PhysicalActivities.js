import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function PhysicalActivities() {
  const activities = [
    { id: '1', title: 'Gross Motor', description: 'Running, jumping, and coordination exercises' },
    { id: '2', title: 'Balance', description: 'Balance beam and stability activities' },
    { id: '3', title: 'Sports', description: 'Basic sports skills and team activities' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Physical Activities</Text>
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
