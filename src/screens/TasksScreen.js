import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TasksScreen() {
  const navigation = useNavigation();
  
  const tasks = [
    { id: '1', title: 'History Quiz', child: 'Emma', due: 'Tomorrow', icon: '📜', status: 'pending' },
    { id: '2', title: 'Math Test', child: 'Noah', due: 'In 2 days', icon: '🔢', status: 'pending' },
    { id: '3', title: 'Book Report', child: 'Emma', due: 'Next Week', icon: '📖', status: 'in-progress' },
    { id: '4', title: 'Science Project', child: 'Noah', due: 'Next Week', icon: '🔬', status: 'completed' },
    { id: '5', title: 'Art Assignment', child: 'Emma', due: 'Today', icon: '🎨', status: 'pending' },
    { id: '6', title: 'Reading Log', child: 'Noah', due: 'Today', icon: '📚', status: 'in-progress' },
  ];

  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => handleTaskPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskIcon}>{item.icon}</Text>
        <View style={[styles.statusBadge, styles[item.status]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <View style={styles.taskInfo}>
        <Text style={styles.childName}>{item.child}</Text>
        <Text style={styles.dueDate}>Due: {item.due}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  taskList: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskIcon: {
    fontSize: 24,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  childName: {
    fontSize: 14,
    color: '#666',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
}); 