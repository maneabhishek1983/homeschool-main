import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function TaskDetailsScreen({ route }) {
  const { task } = route.params;
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const handleToggleStatus = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{task.icon}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.statusBadge, styles[task.status]]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Assigned to:</Text>
            <Text style={styles.value}>{task.child}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{task.due}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{task.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, isCompleted && styles.completedButton]}
            onPress={handleToggleStatus}
          >
            <Text style={styles.actionButtonText}>
              {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
            <Text style={styles.actionButtonText}>Edit Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  'pending': {
    backgroundColor: '#FFE5E5',
  },
  'in-progress': {
    backgroundColor: '#E5F6FF',
  },
  'completed': {
    backgroundColor: '#E5FFE5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  editButton: {
    backgroundColor: '#5856D6',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
}); 