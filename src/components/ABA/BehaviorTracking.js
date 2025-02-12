import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const BehaviorTracking = ({ childId }) => {
  const [behaviors, setBehaviors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  const [trackingData, setTrackingData] = useState({
    frequency: 0,
    duration: 0,
    accuracy: 0,
    notes: '',
  });
  const [timer, setTimer] = useState(null);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchBehaviors();
  }, [childId]);

  const fetchBehaviors = async () => {
    try {
      const behaviorsRef = collection(db, 'behaviors');
      const q = query(behaviorsRef, where('childId', '==', childId));
      const querySnapshot = await getDocs(q);
      
      const behaviorsData = [];
      querySnapshot.forEach(doc => {
        behaviorsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setBehaviors(behaviorsData);
    } catch (error) {
      console.error('Error fetching behaviors:', error);
      Alert.alert('Error', 'Failed to load behaviors');
    }
  };

  const startTracking = (behavior) => {
    setSelectedBehavior(behavior);
    setTrackingData({
      frequency: 0,
      duration: 0,
      accuracy: 0,
      notes: '',
    });
    setModalVisible(true);
  };

  const incrementFrequency = () => {
    setTrackingData(prev => ({
      ...prev,
      frequency: prev.frequency + 1,
    }));
  };

  const startTimer = () => {
    if (!timer) {
      const startTime = Date.now();
      setTimer(startTime);
    }
  };

  const stopTimer = () => {
    if (timer) {
      const duration = Math.round((Date.now() - timer) / 1000);
      setTrackingData(prev => ({
        ...prev,
        duration,
      }));
      setTimer(null);
    }
  };

  const saveTracking = async () => {
    try {
      const trackingRef = collection(db, 'behaviorTracking');
      await addDoc(trackingRef, {
        behaviorId: selectedBehavior.id,
        childId,
        tutorId: currentUser.uid,
        ...trackingData,
        timestamp: serverTimestamp(),
      });

      setModalVisible(false);
      setSelectedBehavior(null);
      Alert.alert('Success', 'Behavior tracking data saved successfully');
    } catch (error) {
      console.error('Error saving tracking data:', error);
      Alert.alert('Error', 'Failed to save tracking data');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.behaviorsList}>
        {behaviors.map(behavior => (
          <TouchableOpacity
            key={behavior.id}
            style={styles.behaviorCard}
            onPress={() => startTracking(behavior)}
          >
            <Text style={styles.behaviorName}>{behavior.name}</Text>
            <Text style={styles.behaviorDescription}>{behavior.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Track Behavior: {selectedBehavior?.name}</Text>

            <View style={styles.trackingSection}>
              <Text style={styles.sectionTitle}>Frequency</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={incrementFrequency}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{trackingData.frequency}</Text>
              </View>
            </View>

            <View style={styles.trackingSection}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.timerContainer}>
                <TouchableOpacity
                  style={[styles.timerButton, timer && styles.timerActive]}
                  onPress={timer ? stopTimer : startTimer}
                >
                  <Text style={styles.timerButtonText}>
                    {timer ? 'Stop' : 'Start'} Timer
                  </Text>
                </TouchableOpacity>
                <Text style={styles.timerText}>{trackingData.duration}s</Text>
              </View>
            </View>

            <View style={styles.trackingSection}>
              <Text style={styles.sectionTitle}>Accuracy (%)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(trackingData.accuracy)}
                onChangeText={(text) => {
                  const value = Math.min(Math.max(parseInt(text) || 0, 0), 100);
                  setTrackingData(prev => ({
                    ...prev,
                    accuracy: value,
                  }));
                }}
              />
            </View>

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add notes..."
              value={trackingData.notes}
              onChangeText={(text) => setTrackingData(prev => ({
                ...prev,
                notes: text,
              }))}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveTracking}
              >
                <Text style={styles.buttonText}>Save Data</Text>
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
  behaviorsList: {
    padding: 16,
  },
  behaviorCard: {
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
  behaviorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  behaviorDescription: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  trackingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerButton: {
    backgroundColor: '#34c759',
    padding: 12,
    borderRadius: 8,
  },
  timerActive: {
    backgroundColor: '#ff3b30',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
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
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 