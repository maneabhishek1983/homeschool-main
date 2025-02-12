import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { activities } from '../../data/activities';

export default function Activities({ route }) {
  const { category, childId } = route.params;
  const [selectedLevel, setSelectedLevel] = useState('Reception');
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedActivities();
  }, [childId, category]);

  const fetchCompletedActivities = async () => {
    try {
      const activitiesRef = collection(db, 'completedActivities');
      const q = query(
        activitiesRef,
        where('childId', '==', childId),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      const completed = {};
      querySnapshot.forEach((doc) => {
        const activity = doc.data();
        completed[activity.activityId] = activity;
      });
      setCompletedActivities(completed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching completed activities:', error);
      setLoading(false);
    }
  };

  const getCategoryActivities = () => {
    const categoryActivities = {};
    Object.entries(activities[category]).forEach(([subcategory, activitiesList]) => {
      categoryActivities[subcategory] = activitiesList.filter(
        activity => activity.level === selectedLevel
      );
    });
    return categoryActivities;
  };

  const getActivityStatus = (activityId) => {
    if (completedActivities[activityId]) {
      const activity = completedActivities[activityId];
      return {
        completed: true,
        date: new Date(activity.completedAt).toLocaleDateString('en-GB'),
        tutor: activity.tutorName
      };
    }
    return { completed: false };
  };

  const renderSubcategoryActivities = (subcategory, activities) => {
    if (activities.length === 0) return null;

    return (
      <View key={subcategory} style={styles.subcategorySection}>
        <Text style={styles.subcategoryTitle}>
          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </Text>
        {activities.map((activity) => {
          const status = getActivityStatus(activity.id);
          return (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.duration}>{activity.duration} mins</Text>
              </View>
              <Text style={styles.description}>{activity.description}</Text>
              {status.completed ? (
                <View style={styles.completedInfo}>
                  <Text style={styles.completedText}>✓ Completed</Text>
                  <Text style={styles.completedMeta}>
                    {status.date} by {status.tutor}
                  </Text>
                </View>
              ) : (
                <Text style={styles.pendingText}>Not completed</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {category.charAt(0).toUpperCase() + category.slice(1)} Activities
      </Text>

      <View style={styles.levelSelector}>
        <TouchableOpacity
          style={[
            styles.levelButton,
            selectedLevel === 'Reception' && styles.selectedLevel
          ]}
          onPress={() => setSelectedLevel('Reception')}
        >
          <Text style={[
            styles.levelText,
            selectedLevel === 'Reception' && styles.selectedLevelText
          ]}>
            Reception
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.levelButton,
            selectedLevel === 'Year 1' && styles.selectedLevel
          ]}
          onPress={() => setSelectedLevel('Year 1')}
        >
          <Text style={[
            styles.levelText,
            selectedLevel === 'Year 1' && styles.selectedLevelText
          ]}>
            Year 1
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading activities...</Text>
      ) : (
        Object.entries(getCategoryActivities()).map(([subcategory, activities]) =>
          renderSubcategoryActivities(subcategory, activities)
        )
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
  levelSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedLevel: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelText: {
    fontSize: 16,
    color: '#666',
  },
  selectedLevelText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  subcategorySection: {
    marginBottom: 25,
  },
  subcategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  activityCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  completedInfo: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  completedMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  pendingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 