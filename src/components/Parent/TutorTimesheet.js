import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { setSelectedChild } from '../../store/slices/childrenSlice';

export default function TutorTimesheet() {
  const dispatch = useDispatch();
  const { children = [], selectedChild, loading } = useSelector(state => state.children || { children: [], selectedChild: null, loading: true });
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedChild) {
      fetchTimesheetData();
    }
  }, [selectedChild, selectedPeriod]);

  const fetchTimesheetData = async () => {
    try {
      setIsLoading(true);
      const timesheetsRef = collection(db, 'tutorTimesheets');
      const q = query(
        timesheetsRef,
        where('childId', '==', selectedChild)
      );
      const querySnapshot = await getDocs(q);
      const timesheets = [];
      querySnapshot.forEach((doc) => {
        timesheets.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTimesheetData(timesheets);
    } catch (error) {
      console.error('Error fetching timesheet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tutor Timesheets</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : children.length === 0 ? (
        <Text style={styles.noDataText}>No children found. Please add a child to view timesheets.</Text>
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Child</Text>
            <Picker
              selectedValue={selectedChild}
              onValueChange={(value) => dispatch(setSelectedChild(value))}
              style={styles.picker}
            >
              {children.map(child => (
                <Picker.Item 
                  key={child.id} 
                  label={child.name} 
                  value={child.id} 
                />
              ))}
            </Picker>
          </View>

          {selectedChild && (
            <>
              <View style={styles.periodContainer}>
                <Text style={styles.label}>Time Period</Text>
                <Picker
                  selectedValue={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                  style={styles.picker}
                >
                  <Picker.Item label="Weekly" value="weekly" />
                  <Picker.Item label="Monthly" value="monthly" />
                </Picker>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
              ) : timesheetData.length > 0 ? (
                <View style={styles.timesheetContainer}>
                  {/* Timesheet data rendering here */}
                  <Text>Timesheet data will be displayed here</Text>
                </View>
              ) : (
                <Text style={styles.noDataText}>No timesheet data available for the selected period.</Text>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  periodContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
  },
  timesheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
}); 