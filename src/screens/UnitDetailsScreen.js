import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUnitProgress } from '../store/slices/syllabusSlice';
import { db } from '../services/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Mock data for development
const MOCK_UNIT = {
  id: '1',
  title: 'Introduction to Numbers',
  subject: 'Math',
  description: 'Learn basic number concepts and counting',
  difficulty: 1,
  progress: 30,
  learningObjectives: [
    'Count numbers from 1 to 10',
    'Recognize number symbols',
    'Match quantities to numbers'
  ],
  prerequisites: [
    'Basic shape recognition',
    'Color identification'
  ],
  activities: [
    {
      id: '1',
      title: 'Counting Game',
      description: 'Interactive game to practice counting objects',
      estimatedDuration: 15,
      completed: true
    },
    {
      id: '2',
      title: 'Number Writing',
      description: 'Practice writing numbers 1-10',
      estimatedDuration: 20,
      completed: false
    }
  ],
  assessments: [
    {
      type: 'quiz',
      description: 'Basic number recognition quiz',
      criteria: [
        'Correctly identify numbers 1-10',
        'Match quantities to numbers',
        'Complete within time limit'
      ]
    }
  ]
};

export default function UnitDetailsScreen({ route, navigation }) {
  const { unitId } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);

  useEffect(() => {
    loadUnitDetails();
  }, [unitId]);

  const loadUnitDetails = async () => {
    try {
      setLoading(true);
      
      // For development, use mock data
      setUnit(MOCK_UNIT);
      setCurrentActivity(MOCK_UNIT.activities.find(a => !a.completed));
      
      /* Uncomment when ready to use real data
      const unitRef = doc(db, 'syllabus_units', unitId);
      const unitDoc = await getDoc(unitRef);
      
      if (unitDoc.exists()) {
        const unitData = { id: unitDoc.id, ...unitDoc.data() };
        setUnit(unitData);
        const firstIncomplete = unitData.activities.find(
          activity => !activity.completed
        );
        setCurrentActivity(firstIncomplete || unitData.activities[0]);
      }
      */
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading unit details:', error);
      setLoading(false);
    }
  };

  const handleActivityComplete = async (activityId) => {
    try {
      // Mark activity as complete
      const updatedActivities = unit.activities.map(activity => {
        if (activity.id === activityId) {
          return { ...activity, completed: true };
        }
        return activity;
      });

      // Calculate unit progress
      const completedCount = updatedActivities.filter(a => a.completed).length;
      const progress = Math.round((completedCount / updatedActivities.length) * 100);

      // Update unit progress in Redux and Firestore
      await dispatch(updateUnitProgress({
        unitId,
        progress,
        activities: updatedActivities
      })).unwrap();

      // Find next activity
      const nextActivity = updatedActivities.find(activity => !activity.completed);
      setCurrentActivity(nextActivity);

      // Update local state
      setUnit(prev => ({
        ...prev,
        activities: updatedActivities,
        progress
      }));
    } catch (error) {
      console.error('Error updating activity progress:', error);
    }
  };

  const renderObjectives = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Learning Objectives</Text>
      {unit.learningObjectives.map((objective, index) => (
        <View key={index} style={styles.objectiveItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.objectiveText}>{objective}</Text>
        </View>
      ))}
    </View>
  );

  const renderPrerequisites = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Prerequisites</Text>
      {unit.prerequisites.map((prerequisite, index) => (
        <View key={index} style={styles.prerequisiteItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.prerequisiteText}>{prerequisite}</Text>
        </View>
      ))}
    </View>
  );

  const renderActivities = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Activities</Text>
      {unit.activities.map((activity, index) => (
        <TouchableOpacity
          key={activity.id}
          style={[
            styles.activityCard,
            activity.completed && styles.activityCardCompleted
          ]}
          onPress={() => navigation.navigate('ActivityDetails', { activity })}
        >
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            {activity.completed && (
              <Text style={styles.completedBadge}>✓</Text>
            )}
          </View>
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>
          <View style={styles.activityMeta}>
            <Text style={styles.metaText}>
              {activity.estimatedDuration} mins
            </Text>
            {currentActivity?.id === activity.id && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleActivityComplete(activity.id)}
              >
                <Text style={styles.completeButtonText}>
                  Mark as Complete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAssessments = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Assessments</Text>
      {unit.assessments.map((assessment, index) => (
        <View key={index} style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Text style={styles.assessmentType}>{assessment.type}</Text>
          </View>
          <Text style={styles.assessmentDescription}>
            {assessment.description}
          </Text>
          <View style={styles.criteriaList}>
            {assessment.criteria.map((criterion, idx) => (
              <Text key={idx} style={styles.criteriaItem}>
                • {criterion}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!unit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unit not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{unit.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.subject}>{unit.subject}</Text>
          <Text style={styles.difficulty}>Level {unit.difficulty}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${unit.progress || 0}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {unit.progress || 0}% Complete
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{unit.description}</Text>
        </View>

        {renderObjectives()}
        {renderPrerequisites()}
        {renderActivities()}
        {renderAssessments()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  subject: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  difficulty: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  objectiveItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  objectiveText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  prerequisiteItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  prerequisiteText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityCardCompleted: {
    backgroundColor: '#f8f8f8',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  completedBadge: {
    color: '#34C759',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  assessmentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assessmentHeader: {
    marginBottom: 10,
  },
  assessmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  assessmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  criteriaList: {
    marginTop: 10,
  },
  criteriaItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 