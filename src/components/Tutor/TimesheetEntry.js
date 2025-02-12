import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimesheetEntry() {
  const [timesheet, setTimesheet] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    activities: '',
    notes: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!timesheet.activities) {
      Alert.alert('Error', 'Please enter activities performed');
      return;
    }

    // Here you would typically save the timesheet to your backend
    console.log('Timesheet:', timesheet);
    
    // Reset form
    setTimesheet({
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      activities: '',
      notes: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Timesheet Entry</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{timesheet.date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text>{timesheet.startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text>{timesheet.endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Activities Performed</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={timesheet.activities}
          onChangeText={(text) => setTimesheet({ ...timesheet, activities: text })}
          placeholder="Enter activities performed"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={timesheet.notes}
          onChangeText={(text) => setTimesheet({ ...timesheet, notes: text })}
          placeholder="Enter any additional notes"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Timesheet</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={timesheet.date}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setTimesheet({ ...timesheet, date: selectedDate });
            }
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={timesheet.startTime}
          mode="time"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setTimesheet({ ...timesheet, startTime: selectedTime });
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={timesheet.endTime}
          mode="time"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setTimesheet({ ...timesheet, endTime: selectedTime });
            }
          }}
        />
      )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
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
