import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function ActivityLogging() {
  const [activityLog, setActivityLog] = useState({
    title: '',
    duration: '',
    description: '',
    notes: '',
  });

  const handleSubmit = () => {
    // Here you would typically save the activity log to your backend
    console.log('Activity Log:', activityLog);
    // Reset form
    setActivityLog({
      title: '',
      duration: '',
      description: '',
      notes: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log Activity</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Activity Title</Text>
        <TextInput
          style={styles.input}
          value={activityLog.title}
          onChangeText={(text) => setActivityLog({ ...activityLog, title: text })}
          placeholder="Enter activity title"
        />

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={activityLog.duration}
          onChangeText={(text) => setActivityLog({ ...activityLog, duration: text })}
          placeholder="Enter duration"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={activityLog.description}
          onChangeText={(text) => setActivityLog({ ...activityLog, description: text })}
          placeholder="Enter activity description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={activityLog.notes}
          onChangeText={(text) => setActivityLog({ ...activityLog, notes: text })}
          placeholder="Enter any additional notes"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Log</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
