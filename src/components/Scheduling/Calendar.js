import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [sessions, setSessions] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({
    title: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const currentUser = useSelector(state => state.auth.user);
  const isParent = currentUser?.role === 'parent';

  useEffect(() => {
    fetchSessions();
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      const sessionsRef = collection(db, 'sessions');
      const q = isParent
        ? query(sessionsRef, where('parentId', '==', currentUser.uid))
        : query(sessionsRef, where('tutorId', '==', currentUser.uid));

      const querySnapshot = await getDocs(q);
      const sessionsData = {};

      querySnapshot.forEach(doc => {
        const session = doc.data();
        const dateStr = session.date;
        if (!sessionsData[dateStr]) {
          sessionsData[dateStr] = [];
        }
        sessionsData[dateStr].push({
          id: doc.id,
          ...session,
        });
      });

      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Failed to load sessions');
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const validateTime = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleAddSession = async () => {
    if (!sessionDetails.title || !sessionDetails.startTime || !sessionDetails.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateTime(sessionDetails.startTime) || !validateTime(sessionDetails.endTime)) {
      Alert.alert('Error', 'Please enter valid times in HH:MM format');
      return;
    }

    try {
      const sessionsRef = collection(db, 'sessions');
      await addDoc(sessionsRef, {
        ...sessionDetails,
        date: selectedDate,
        parentId: isParent ? currentUser.uid : sessionDetails.parentId,
        tutorId: isParent ? sessionDetails.tutorId : currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setModalVisible(false);
      setSessionDetails({
        title: '',
        startTime: '',
        endTime: '',
        notes: '',
      });
      fetchSessions();
    } catch (error) {
      console.error('Error adding session:', error);
      Alert.alert('Error', 'Failed to add session');
    }
  };

  const renderSessions = () => {
    if (!selectedDate || !sessions[selectedDate]) return null;

    return (
      <ScrollView style={styles.sessionsList}>
        {sessions[selectedDate].map((session, index) => (
          <View key={session.id} style={styles.sessionItem}>
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionTime}>
              {session.startTime} - {session.endTime}
            </Text>
            {session.notes && (
              <Text style={styles.sessionNotes}>{session.notes}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  const markedDates = {};
  Object.keys(sessions).forEach(date => {
    markedDates[date] = {
      marked: true,
      dotColor: '#0066cc',
    };
  });
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#0066cc',
    };
  }

  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#0066cc',
          todayTextColor: '#0066cc',
          arrowColor: '#0066cc',
        }}
      />
      {renderSessions()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Session</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Session Title"
              value={sessionDetails.title}
              onChangeText={(text) => setSessionDetails(prev => ({ ...prev, title: text }))}
            />
            
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="Start Time (HH:MM)"
                value={sessionDetails.startTime}
                onChangeText={(text) => setSessionDetails(prev => ({ ...prev, startTime: text }))}
              />
              <TextInput
                style={[styles.input, styles.timeInput]}
                placeholder="End Time (HH:MM)"
                value={sessionDetails.endTime}
                onChangeText={(text) => setSessionDetails(prev => ({ ...prev, endTime: text }))}
              />
            </View>

            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Notes (optional)"
              value={sessionDetails.notes}
              onChangeText={(text) => setSessionDetails(prev => ({ ...prev, notes: text }))}
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
                style={[styles.button, styles.addButton]}
                onPress={handleAddSession}
              >
                <Text style={styles.buttonText}>Add Session</Text>
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
  sessionsList: {
    maxHeight: 200,
    padding: 16,
  },
  sessionItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 0.48,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  addButton: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Calendar; 