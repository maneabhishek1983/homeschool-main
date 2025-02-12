import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const SyllabusEditor = () => {
  const [subjects, setSubjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState({
    name: '',
    description: '',
    objectives: '',
    level: 'reception', // or 'year1'
  });
  const [suggestions, setSuggestions] = useState([]);
  const currentUser = useSelector(state => state.auth.user);
  const isParent = currentUser?.role === 'parent';

  useEffect(() => {
    fetchSyllabus();
    if (!isParent) {
      fetchSuggestions();
    }
  }, [currentUser]);

  const fetchSyllabus = async () => {
    try {
      const syllabusRef = collection(db, 'syllabus');
      const q = query(syllabusRef, where('parentId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const syllabusData = [];
      querySnapshot.forEach(doc => {
        syllabusData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setSubjects(syllabusData);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      Alert.alert('Error', 'Failed to load syllabus');
    }
  };

  const fetchSuggestions = async () => {
    try {
      const suggestionsRef = collection(db, 'syllabusSuggestions');
      const q = query(suggestionsRef, where('tutorId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const suggestionsData = [];
      querySnapshot.forEach(doc => {
        suggestionsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleAddSubject = async () => {
    if (!subjectDetails.name || !subjectDetails.description || !subjectDetails.objectives) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const syllabusRef = collection(db, 'syllabus');
      await addDoc(syllabusRef, {
        ...subjectDetails,
        parentId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setModalVisible(false);
      setSubjectDetails({
        name: '',
        description: '',
        objectives: '',
        level: 'reception',
      });
      fetchSyllabus();
    } catch (error) {
      console.error('Error adding subject:', error);
      Alert.alert('Error', 'Failed to add subject');
    }
  };

  const handleEditSubject = async () => {
    if (!selectedSubject) return;

    try {
      const subjectRef = doc(db, 'syllabus', selectedSubject.id);
      await updateDoc(subjectRef, {
        ...subjectDetails,
        updatedAt: serverTimestamp(),
      });

      setModalVisible(false);
      setSelectedSubject(null);
      setSubjectDetails({
        name: '',
        description: '',
        objectives: '',
        level: 'reception',
      });
      fetchSyllabus();
    } catch (error) {
      console.error('Error updating subject:', error);
      Alert.alert('Error', 'Failed to update subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, 'syllabus', subjectId));
      fetchSyllabus();
    } catch (error) {
      console.error('Error deleting subject:', error);
      Alert.alert('Error', 'Failed to delete subject');
    }
  };

  const handleSuggestModification = async (subjectId, suggestion) => {
    try {
      const suggestionsRef = collection(db, 'syllabusSuggestions');
      await addDoc(suggestionsRef, {
        subjectId,
        tutorId: currentUser.uid,
        tutorName: currentUser.displayName,
        suggestion,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your suggestion has been submitted');
      fetchSuggestions();
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      Alert.alert('Error', 'Failed to submit suggestion');
    }
  };

  const renderSubjects = () => {
    return subjects.map(subject => (
      <View key={subject.id} style={styles.subjectCard}>
        <View style={styles.subjectHeader}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Text style={styles.subjectLevel}>Level: {subject.level}</Text>
        </View>
        
        <Text style={styles.subjectDescription}>{subject.description}</Text>
        <Text style={styles.subjectObjectives}>Objectives: {subject.objectives}</Text>
        
        {isParent ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSelectedSubject(subject);
                setSubjectDetails({
                  name: subject.name,
                  description: subject.description,
                  objectives: subject.objectives,
                  level: subject.level,
                });
                setModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSubject(subject.id)}
            >
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.suggestButton}
            onPress={() => {
              Alert.prompt(
                'Suggest Modification',
                'Please enter your suggestion:',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Submit',
                    onPress: (suggestion) => {
                      if (suggestion) {
                        handleSuggestModification(subject.id, suggestion);
                      }
                    },
                  },
                ],
                'plain-text'
              );
            }}
          >
            <Text style={styles.suggestButtonText}>Suggest Modification</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderSubjects()}
        {suggestions.length > 0 && !isParent && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>Your Suggestions</Text>
            {suggestions.map(suggestion => (
              <View key={suggestion.id} style={styles.suggestionCard}>
                <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
                <Text style={styles.suggestionStatus}>Status: {suggestion.status}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {isParent && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedSubject(null);
            setSubjectDetails({
              name: '',
              description: '',
              objectives: '',
              level: 'reception',
            });
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedSubject ? 'Edit Subject' : 'Add New Subject'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Subject Name"
              value={subjectDetails.name}
              onChangeText={(text) => setSubjectDetails(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={subjectDetails.description}
              onChangeText={(text) => setSubjectDetails(prev => ({ ...prev, description: text }))}
              multiline
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Learning Objectives"
              value={subjectDetails.objectives}
              onChangeText={(text) => setSubjectDetails(prev => ({ ...prev, objectives: text }))}
              multiline
            />

            <View style={styles.levelButtons}>
              <TouchableOpacity
                style={[
                  styles.levelButton,
                  subjectDetails.level === 'reception' && styles.levelButtonActive,
                ]}
                onPress={() => setSubjectDetails(prev => ({ ...prev, level: 'reception' }))}
              >
                <Text style={[
                  styles.levelButtonText,
                  subjectDetails.level === 'reception' && styles.levelButtonTextActive,
                ]}>Reception</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.levelButton,
                  subjectDetails.level === 'year1' && styles.levelButtonActive,
                ]}
                onPress={() => setSubjectDetails(prev => ({ ...prev, level: 'year1' }))}
              >
                <Text style={[
                  styles.levelButtonText,
                  subjectDetails.level === 'year1' && styles.levelButtonTextActive,
                ]}>Year 1</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={selectedSubject ? handleEditSubject : handleAddSubject}
              >
                <Text style={styles.buttonText}>
                  {selectedSubject ? 'Save Changes' : 'Add Subject'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  subjectCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subjectLevel: {
    fontSize: 14,
    color: '#666',
  },
  subjectDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  subjectObjectives: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#0066cc',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 4,
  },
  suggestButton: {
    backgroundColor: '#34c759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  suggestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#0066cc',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelButton: {
    flex: 0.48,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  levelButtonActive: {
    backgroundColor: '#0066cc',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  saveButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  suggestionStatus: {
    fontSize: 14,
    color: '#666',
  },
});

export default SyllabusEditor; 