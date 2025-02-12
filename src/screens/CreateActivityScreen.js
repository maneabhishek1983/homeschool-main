import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Switch, Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { createActivity, createABAActivity } from '../store/slices/activitiesSlice';

const yearGroups = ['Reception', 'Year1', 'Year2', 'Year3', 'Year4'];
const subjects = ['Math', 'English', 'Science', 'Art', 'Physical Education'];
const difficultyLevels = [1, 2, 3, 4, 5];

export default function CreateActivityScreen({ navigation }) {
  const dispatch = useDispatch();
  const [isABAActivity, setIsABAActivity] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: subjects[0],
    yearGroups: [],
    difficultyLevel: 1,
    objectives: [''],
    instructionalSteps: [''],
    prerequisiteSkills: [''],
    mediaLinks: [],
    // ABA specific fields
    targetBehavior: '',
    promptingGuidelines: [{level: '', description: ''}],
    reinforcementStrategy: { type: '', description: '' },
    measurementMethod: { type: 'frequency', description: '' }
  });

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], field === 'mediaLinks' ? {type: 'video', url: ''} : '']
    });
  };

  const removeField = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const updateField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async () => {
    try {
      if (isABAActivity) {
        await dispatch(createABAActivity({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })).unwrap();
      } else {
        await dispatch(createActivity({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        })).unwrap();
      }
      Alert.alert('Success', 'Activity created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Activity</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>ABA Activity</Text>
          <Switch
            value={isABAActivity}
            onValueChange={setIsABAActivity}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
            placeholder="Enter activity title"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            placeholder="Enter activity description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Subject</Text>
          <Picker
            selectedValue={formData.subject}
            onValueChange={(value) => setFormData({...formData, subject: value})}
            style={styles.picker}
          >
            {subjects.map((subject) => (
              <Picker.Item key={subject} label={subject} value={subject} />
            ))}
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Year Groups</Text>
          <View style={styles.chipContainer}>
            {yearGroups.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.chip,
                  formData.yearGroups.includes(year) && styles.chipSelected
                ]}
                onPress={() => {
                  const newYearGroups = formData.yearGroups.includes(year)
                    ? formData.yearGroups.filter(y => y !== year)
                    : [...formData.yearGroups, year];
                  setFormData({...formData, yearGroups: newYearGroups});
                }}
              >
                <Text style={[
                  styles.chipText,
                  formData.yearGroups.includes(year) && styles.chipTextSelected
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Difficulty Level</Text>
          <Picker
            selectedValue={formData.difficultyLevel}
            onValueChange={(value) => setFormData({...formData, difficultyLevel: value})}
            style={styles.picker}
          >
            {difficultyLevels.map((level) => (
              <Picker.Item key={level} label={`Level ${level}`} value={level} />
            ))}
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Objectives</Text>
          {formData.objectives.map((objective, index) => (
            <View key={index} style={styles.arrayField}>
              <TextInput
                style={[styles.input, styles.arrayInput]}
                value={objective}
                onChangeText={(text) => updateField('objectives', index, text)}
                placeholder={`Objective ${index + 1}`}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeField('objectives', index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addField('objectives')}
          >
            <Text style={styles.addButtonText}>+ Add Objective</Text>
          </TouchableOpacity>
        </View>

        {isABAActivity && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Target Behavior</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.targetBehavior}
                onChangeText={(text) => setFormData({...formData, targetBehavior: text})}
                placeholder="Describe the target behavior"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Measurement Method</Text>
              <Picker
                selectedValue={formData.measurementMethod.type}
                onValueChange={(value) => setFormData({
                  ...formData,
                  measurementMethod: { ...formData.measurementMethod, type: value }
                })}
                style={styles.picker}
              >
                <Picker.Item label="Frequency" value="frequency" />
                <Picker.Item label="Duration" value="duration" />
                <Picker.Item label="Accuracy" value="accuracy" />
              </Picker>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.measurementMethod.description}
                onChangeText={(text) => setFormData({
                  ...formData,
                  measurementMethod: { ...formData.measurementMethod, description: text }
                })}
                placeholder="Describe how to measure progress"
                multiline
                numberOfLines={3}
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create Activity</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  arrayField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrayInput: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
}); 