import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ReportGeneration() {
  const [selectedReport, setSelectedReport] = useState('weekly');
  const [selectedChild, setSelectedChild] = useState('');

  const children = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Doe' },
  ];

  const mockData = {
    academic: { completed: 15, total: 20 },
    physical: { completed: 8, total: 10 },
    behavioral: { completed: 12, total: 15 }
  };

  const generateReport = () => {
    // Here you would typically generate and export the report
    console.log('Generating report for:', selectedChild, 'Type:', selectedReport);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate Report</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Child</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedChild}
            onValueChange={(value) => setSelectedChild(value)}
          >
            <Picker.Item label="Select a child" value="" />
            {children.map((child) => (
              <Picker.Item key={child.id} label={child.name} value={child.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Report Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedReport}
            onValueChange={(value) => setSelectedReport(value)}
          >
            <Picker.Item label="Weekly Report" value="weekly" />
            <Picker.Item label="Monthly Report" value="monthly" />
            <Picker.Item label="Quarterly Report" value="quarterly" />
          </Picker>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.subtitle}>Progress Summary</Text>
        
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Academic Progress</Text>
          <Text style={styles.statText}>
            {mockData.academic.completed}/{mockData.academic.total} Activities
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Physical Activities</Text>
          <Text style={styles.statText}>
            {mockData.physical.completed}/{mockData.physical.total} Activities
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Behavioral Progress</Text>
          <Text style={styles.statText}>
            {mockData.behavioral.completed}/{mockData.behavioral.total} Goals
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
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
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
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
