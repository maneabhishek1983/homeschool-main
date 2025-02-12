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
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const BehaviorPlan = ({ childId }) => {
  const [plans, setPlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planData, setPlanData] = useState({
    targetBehavior: '',
    replacementBehavior: '',
    antecedents: '',
    consequences: '',
    reinforcementStrategy: '',
    criteria: '',
    notes: '',
  });
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchPlans();
  }, [childId]);

  const fetchPlans = async () => {
    try {
      const plansRef = collection(db, 'behaviorPlans');
      const q = query(plansRef, where('childId', '==', childId));
      const querySnapshot = await getDocs(q);
      
      const plansData = [];
      querySnapshot.forEach(doc => {
        plansData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching behavior plans:', error);
      Alert.alert('Error', 'Failed to load behavior plans');
    }
  };

  const handleSavePlan = async () => {
    if (!planData.targetBehavior || !planData.replacementBehavior) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (selectedPlan) {
        // Update existing plan
        const planRef = doc(db, 'behaviorPlans', selectedPlan.id);
        await updateDoc(planRef, {
          ...planData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new plan
        const plansRef = collection(db, 'behaviorPlans');
        await addDoc(plansRef, {
          ...planData,
          childId,
          createdBy: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'active',
        });
      }

      setModalVisible(false);
      setSelectedPlan(null);
      setPlanData({
        targetBehavior: '',
        replacementBehavior: '',
        antecedents: '',
        consequences: '',
        reinforcementStrategy: '',
        criteria: '',
        notes: '',
      });
      fetchPlans();
    } catch (error) {
      console.error('Error saving behavior plan:', error);
      Alert.alert('Error', 'Failed to save behavior plan');
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanData({
      targetBehavior: plan.targetBehavior,
      replacementBehavior: plan.replacementBehavior,
      antecedents: plan.antecedents || '',
      consequences: plan.consequences || '',
      reinforcementStrategy: plan.reinforcementStrategy || '',
      criteria: plan.criteria || '',
      notes: plan.notes || '',
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.plansList}>
        {plans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handleEditPlan(plan)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Target: {plan.targetBehavior}</Text>
              <Text style={styles.planStatus}>{plan.status}</Text>
            </View>
            
            <Text style={styles.planSubtitle}>
              Replacement: {plan.replacementBehavior}
            </Text>
            
            {plan.reinforcementStrategy && (
              <Text style={styles.planStrategy}>
                Strategy: {plan.reinforcementStrategy}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedPlan(null);
          setPlanData({
            targetBehavior: '',
            replacementBehavior: '',
            antecedents: '',
            consequences: '',
            reinforcementStrategy: '',
            criteria: '',
            notes: '',
          });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedPlan ? 'Edit Behavior Plan' : 'New Behavior Plan'}
            </Text>

            <ScrollView style={styles.form}>
              <Text style={styles.label}>Target Behavior *</Text>
              <TextInput
                style={styles.input}
                value={planData.targetBehavior}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  targetBehavior: text,
                }))}
                placeholder="Describe the behavior to decrease"
              />

              <Text style={styles.label}>Replacement Behavior *</Text>
              <TextInput
                style={styles.input}
                value={planData.replacementBehavior}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  replacementBehavior: text,
                }))}
                placeholder="Describe the desired alternative behavior"
              />

              <Text style={styles.label}>Antecedents</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={planData.antecedents}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  antecedents: text,
                }))}
                placeholder="What typically triggers the behavior?"
                multiline
              />

              <Text style={styles.label}>Consequences</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={planData.consequences}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  consequences: text,
                }))}
                placeholder="What typically happens after the behavior?"
                multiline
              />

              <Text style={styles.label}>Reinforcement Strategy</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={planData.reinforcementStrategy}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  reinforcementStrategy: text,
                }))}
                placeholder="How will you reinforce the replacement behavior?"
                multiline
              />

              <Text style={styles.label}>Success Criteria</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={planData.criteria}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  criteria: text,
                }))}
                placeholder="What are the goals for behavior change?"
                multiline
              />

              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={planData.notes}
                onChangeText={(text) => setPlanData(prev => ({
                  ...prev,
                  notes: text,
                }))}
                placeholder="Any additional information or instructions"
                multiline
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSavePlan}
              >
                <Text style={styles.buttonText}>
                  {selectedPlan ? 'Update Plan' : 'Create Plan'}
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
  plansList: {
    padding: 16,
  },
  planCard: {
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  planStatus: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
    marginLeft: 8,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  planStrategy: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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