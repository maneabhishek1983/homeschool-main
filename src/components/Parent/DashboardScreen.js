import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { setSelectedChild } from '../../store/slices/childrenSlice';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { children = [], selectedChild, loading } = useSelector(state => state.children || { children: [], selectedChild: null, loading: true });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    if (selectedChild) {
      fetchRecentActivities();
      fetchUpcomingTasks();
    }
  }, [selectedChild]);

  const fetchRecentActivities = async () => {
    try {
      const activitiesRef = collection(db, 'completedActivities');
      const q = query(
        activitiesRef,
        where('childId', '==', selectedChild),
        orderBy('completedAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const activitiesData = [];
      querySnapshot.forEach((doc) => {
        activitiesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('childId', '==', selectedChild),
        where('completed', '==', false),
        orderBy('dueDate', 'asc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setUpcomingTasks(tasksData);
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
    }
  };

  const navigateToCategory = (category) => {
    navigation.navigate('Activities', {
      category,
      childId: selectedChild
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : children.length === 0 ? (
        <Text style={styles.noDataText}>No children found. Please add a child to get started.</Text>
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
              <View style={styles.categoryContainer}>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => navigateToCategory('academic')}
                >
                  <Text style={styles.categoryTitle}>Academic</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => navigateToCategory('physical')}
                >
                  <Text style={styles.categoryTitle}>Physical</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.categoryCard}
                  onPress={() => navigateToCategory('occupational')}
                >
                  <Text style={styles.categoryTitle}>Occupational</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <View key={activity.id} style={styles.activityCard}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                      <Text style={styles.activityDate}>
                        {new Date(activity.completedAt.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No recent activities</Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(task => (
                    <View key={task.id} style={styles.taskCard}>
                      <Text style={styles.taskName}>{task.name}</Text>
                      <Text style={styles.taskDate}>
                        Due: {new Date(task.dueDate.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No upcoming tasks</Text>
                )}
              </View>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  activityCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  activityName: {
    fontSize: 16,
    color: '#333',
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  taskCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  taskName: {
    fontSize: 16,
    color: '#333',
  },
  taskDate: {
    fontSize: 14,
    color: '#666',
  },
});
