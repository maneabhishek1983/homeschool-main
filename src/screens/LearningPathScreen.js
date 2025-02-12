import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { generateLearningPath, updateUnitProgress } from '../store/slices/syllabusSlice';

export default function LearningPathScreen({ route, navigation }) {
  const { childId, yearGroup } = route.params;
  const dispatch = useDispatch();
  const {
    currentLearningPath,
    recommendations,
    loading,
    error
  } = useSelector(state => state.syllabus);

  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    if (!currentLearningPath) {
      dispatch(generateLearningPath({
        childId,
        yearGroup,
        subjects: ['Math', 'English', 'Science', 'Art', 'Physical Education']
      }));
    }
  }, [childId, yearGroup, dispatch]);

  const getSubjectColor = (subject) => {
    const colors = {
      Math: '#007AFF',
      English: '#34C759',
      Science: '#FF9500',
      Art: '#AF52DE',
      'Physical Education': '#FF2D55'
    };
    return colors[subject] || '#8E8E93';
  };

  const renderSubjectFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterContainer}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedSubject === 'all' && styles.filterChipSelected
        ]}
        onPress={() => setSelectedSubject('all')}
      >
        <Text style={[
          styles.filterChipText,
          selectedSubject === 'all' && styles.filterChipTextSelected
        ]}>All Subjects</Text>
      </TouchableOpacity>
      {currentLearningPath?.currentLevel && Object.keys(currentLearningPath.currentLevel).map((subject) => (
        <TouchableOpacity
          key={subject}
          style={[
            styles.filterChip,
            selectedSubject === subject && styles.filterChipSelected,
            { borderColor: getSubjectColor(subject) }
          ]}
          onPress={() => setSelectedSubject(subject)}
        >
          <Text style={[
            styles.filterChipText,
            selectedSubject === subject && styles.filterChipTextSelected,
            { color: getSubjectColor(subject) }
          ]}>{subject}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderUnit = (unit) => (
    <TouchableOpacity
      key={unit.unitId}
      style={styles.unitCard}
      onPress={() => navigation.navigate('UnitDetails', { unitId: unit.unitId })}
    >
      <View style={styles.unitHeader}>
        <Text style={styles.unitTitle}>{unit.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: unit.status === 'completed' ? '#34C759' : '#007AFF' }
        ]}>
          <Text style={styles.statusText}>
            {unit.status === 'completed' ? 'Completed' : 'In Progress'}
          </Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${unit.progress || 0}%` }
          ]}
        />
      </View>

      <View style={styles.unitMeta}>
        <Text style={styles.metaText}>
          Difficulty: Level {unit.difficulty}
        </Text>
        <Text style={styles.metaText}>
          {unit.estimatedDuration} mins
        </Text>
      </View>

      {unit.adaptations && unit.adaptations.length > 0 && (
        <View style={styles.adaptationsList}>
          {unit.adaptations.map((adaptation, index) => (
            <View key={index} style={styles.adaptationItem}>
              <Text style={styles.adaptationType}>{adaptation.type}</Text>
              <Text style={styles.adaptationReason}>{adaptation.reason}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRecommendations = () => (
    <View style={styles.recommendationsSection}>
      <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
      {recommendations.slice(0, 3).map((recommendation) => (
        <TouchableOpacity
          key={recommendation.unitId}
          style={styles.recommendationCard}
          onPress={() => navigation.navigate('UnitDetails', { unitId: recommendation.unitId })}
        >
          <Text style={styles.recommendationTitle}>
            {recommendation.title}
          </Text>
          <Text style={styles.recommendationReason}>
            {recommendation.reason}
          </Text>
        </TouchableOpacity>
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(generateLearningPath({
            childId,
            yearGroup,
            subjects: ['Math', 'English', 'Science', 'Art', 'Physical Education']
          }))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderSubjectFilter()}
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Path</Text>
          <Text style={styles.headerSubtitle}>
            {yearGroup} • {Object.keys(currentLearningPath?.currentLevel || {}).length} Subjects
          </Text>
        </View>

        <View style={styles.progressOverview}>
          {currentLearningPath?.currentLevel && Object.entries(currentLearningPath.currentLevel).map(([subject, level]) => (
            <View key={subject} style={styles.levelCard}>
              <Text style={[styles.levelSubject, { color: getSubjectColor(subject) }]}>
                {subject}
              </Text>
              <Text style={styles.levelValue}>Level {level}</Text>
            </View>
          ))}
        </View>

        {renderRecommendations()}

        <View style={styles.unitsSection}>
          <Text style={styles.sectionTitle}>Current Units</Text>
          {currentLearningPath?.units
            .filter(unit => selectedSubject === 'all' || unit.subject === selectedSubject)
            .map(renderUnit)}
        </View>
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContainer: {
    padding: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  filterChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  progressOverview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelSubject: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendationCard: {
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
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recommendationReason: {
    fontSize: 14,
    color: '#666',
  },
  unitsSection: {
    padding: 20,
  },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  unitMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  adaptationsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  adaptationItem: {
    marginBottom: 5,
  },
  adaptationType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  adaptationReason: {
    fontSize: 12,
    color: '#666',
  },
}); 