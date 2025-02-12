import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllActivities, getActivitiesByLevel, getActivitiesByCategory } from '../../data/activities';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Reception');
  const [selectedCategory, setSelectedCategory] = useState('academic');
  const [customTaskName, setCustomTaskName] = useState('');

  const activities = getAllActivities();
  const filteredActivities = selectedLevel ? 
    getActivitiesByLevel(selectedLevel) : 
    activities;

  const addTask = () => {
    if (!selectedActivity && !customTaskName.trim()) {
      Alert.alert('Error', 'Please select an activity or enter a custom task');
      return;
    }

    const activity = selectedActivity ? 
      activities.find(act => act.id === selectedActivity) : 
      { id: Date.now().toString(), name: customTaskName, custom: true };

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        activityId: activity.id,
        title: activity.name,
        description: activity.description || '',
        completed: false,
        level: selectedLevel,
        category: selectedCategory,
        custom: activity.custom || false,
        assignedAt: new Date().toISOString(),
      },
    ]);

    setSelectedActivity('');
    setCustomTaskName('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.taskCompleted]}
      onPress={() => toggleTask(item.id)}
    >
      <View>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.taskDescription}>{item.description}</Text>
        )}
        <Text style={styles.taskMeta}>
          {item.level} • {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Management</Text>
      
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Level</Text>
          <Picker
            selectedValue={selectedLevel}
            onValueChange={setSelectedLevel}
            style={styles.picker}
          >
            <Picker.Item label="Reception" value="Reception" />
            <Picker.Item label="Year 1" value="Year 1" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Category</Text>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="Academic" value="academic" />
            <Picker.Item label="Physical" value="physical" />
            <Picker.Item label="Occupational" value="occupational" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Activity</Text>
          <Picker
            selectedValue={selectedActivity}
            onValueChange={setSelectedActivity}
            style={styles.picker}
          >
            <Picker.Item label="Select an activity" value="" />
            {filteredActivities.map((activity) => (
              <Picker.Item
                key={activity.id}
                label={activity.name}
                value={activity.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Or Add Custom Task</Text>
        <TextInput
          style={styles.input}
          value={customTaskName}
          onChangeText={setCustomTaskName}
          placeholder="Enter custom task name"
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        style={styles.list}
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
  filterContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskCompleted: {
    backgroundColor: '#e8e8e8',
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  taskMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
});
