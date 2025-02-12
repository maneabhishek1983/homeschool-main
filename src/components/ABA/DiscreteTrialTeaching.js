import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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

const PROMPT_LEVELS = {
  FULL_PHYSICAL: 'Full Physical',
  PARTIAL_PHYSICAL: 'Partial Physical',
  FULL_VERBAL: 'Full Verbal',
  PARTIAL_VERBAL: 'Partial Verbal',
  GESTURAL: 'Gestural',
  VISUAL: 'Visual',
  INDEPENDENT: 'Independent',
};

const DiscreteTrialTeaching = ({ childId }) => {
  const [trials, setTrials] = useState([]);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [trialData, setTrialData] = useState({
    promptLevel: PROMPT_LEVELS.FULL_PHYSICAL,
    response: null,
    notes: '',
  });
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchTrials();
  }, [childId]);

  const fetchTrials = async () => {
    try {
      const trialsRef = collection(db, 'dttTrials');
      const q = query(trialsRef, where('childId', '==', childId));
      const querySnapshot = await getDocs(q);
      
      const trialsData = [];
      querySnapshot.forEach(doc => {
        trialsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setTrials(trialsData);
    } catch (error) {
      console.error('Error fetching trials:', error);
      Alert.alert('Error', 'Failed to load trials');
    }
  };

  const startSession = (trial) => {
    setCurrentTrial(trial);
    setTrialData({
      promptLevel: PROMPT_LEVELS.FULL_PHYSICAL,
      response: null,
      notes: '',
    });
    setSessionActive(true);
  };

  const recordResponse = async (correct) => {
    try {
      const responseRef = collection(db, 'dttResponses');
      await addDoc(responseRef, {
        trialId: currentTrial.id,
        childId,
        tutorId: currentUser.uid,
        promptLevel: trialData.promptLevel,
        correct,
        notes: trialData.notes,
        timestamp: serverTimestamp(),
      });

      // If response was correct with current prompt level, suggest fading to next level
      if (correct && trialData.promptLevel !== PROMPT_LEVELS.INDEPENDENT) {
        const promptLevels = Object.values(PROMPT_LEVELS);
        const currentIndex = promptLevels.indexOf(trialData.promptLevel);
        if (currentIndex < promptLevels.length - 1) {
          Alert.alert(
            'Prompt Fading',
            'Consider reducing prompt level for next trial',
            [
              {
                text: 'Keep Current',
                style: 'cancel',
              },
              {
                text: 'Reduce Prompt',
                onPress: () => setTrialData(prev => ({
                  ...prev,
                  promptLevel: promptLevels[currentIndex + 1],
                })),
              },
            ]
          );
        }
      }
      
      // If incorrect, suggest increasing prompt level
      if (!correct && trialData.promptLevel !== PROMPT_LEVELS.FULL_PHYSICAL) {
        const promptLevels = Object.values(PROMPT_LEVELS);
        const currentIndex = promptLevels.indexOf(trialData.promptLevel);
        if (currentIndex > 0) {
          Alert.alert(
            'Prompt Adjustment',
            'Consider increasing prompt level for next trial',
            [
              {
                text: 'Keep Current',
                style: 'cancel',
              },
              {
                text: 'Increase Prompt',
                onPress: () => setTrialData(prev => ({
                  ...prev,
                  promptLevel: promptLevels[currentIndex - 1],
                })),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error recording response:', error);
      Alert.alert('Error', 'Failed to record response');
    }
  };

  const endSession = () => {
    setSessionActive(false);
    setCurrentTrial(null);
    setTrialData({
      promptLevel: PROMPT_LEVELS.FULL_PHYSICAL,
      response: null,
      notes: '',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.trialsList}>
        {trials.map(trial => (
          <TouchableOpacity
            key={trial.id}
            style={styles.trialCard}
            onPress={() => startSession(trial)}
          >
            <Text style={styles.trialName}>{trial.name}</Text>
            <Text style={styles.trialDescription}>{trial.description}</Text>
            <Text style={styles.trialObjective}>Target: {trial.targetBehavior}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sessionActive}
        onRequestClose={endSession}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trial: {currentTrial?.name}</Text>
            
            <View style={styles.promptSection}>
              <Text style={styles.sectionTitle}>Current Prompt Level</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.promptLevels}
              >
                {Object.values(PROMPT_LEVELS).map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.promptButton,
                      trialData.promptLevel === level && styles.promptButtonActive,
                    ]}
                    onPress={() => setTrialData(prev => ({
                      ...prev,
                      promptLevel: level,
                    }))}
                  >
                    <Text style={[
                      styles.promptButtonText,
                      trialData.promptLevel === level && styles.promptButtonTextActive,
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.responseButtons}>
              <TouchableOpacity
                style={[styles.button, styles.incorrectButton]}
                onPress={() => recordResponse(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
                <Text style={styles.buttonText}>Incorrect</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.correctButton]}
                onPress={() => recordResponse(true)}
              >
                <Ionicons name="checkmark" size={24} color="#fff" />
                <Text style={styles.buttonText}>Correct</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.endButton]}
              onPress={endSession}
            >
              <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
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
  trialsList: {
    padding: 16,
  },
  trialCard: {
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
  trialName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  trialObjective: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
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
  promptSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  promptLevels: {
    flexGrow: 0,
    marginBottom: 16,
  },
  promptButton: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  promptButtonActive: {
    backgroundColor: '#0066cc',
  },
  promptButtonText: {
    fontSize: 14,
    color: '#666',
  },
  promptButtonTextActive: {
    color: '#fff',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  incorrectButton: {
    backgroundColor: '#ff3b30',
  },
  correctButton: {
    backgroundColor: '#34c759',
  },
  endButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 