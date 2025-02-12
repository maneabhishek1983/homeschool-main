import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { db } from '../services/firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Mock data for initial development
const MOCK_DATA = {
  learning: [
    { subject: 'Math', date: '2024-03-01', score: 85 },
    { subject: 'Math', date: '2024-03-15', score: 90 },
    { subject: 'English', date: '2024-03-01', score: 75 },
    { subject: 'English', date: '2024-03-15', score: 80 },
  ],
  behavior: [
    { id: '1', targetBehavior: 'Task Completion', status: 'in-progress', currentProgress: 7, target: 10, startDate: '2024-03-01' },
    { id: '2', targetBehavior: 'Following Instructions', status: 'completed', currentProgress: 5, target: 5, startDate: '2024-03-01' },
  ],
  achievements: [
    { id: '1', title: 'Math Master', dateAwarded: '2024-03-15', description: 'Completed 10 math activities with high scores' },
    { id: '2', title: 'Reading Star', dateAwarded: '2024-03-10', description: 'Read 5 books and completed comprehension tasks' },
  ]
};

export default function ProgressTrackingScreen({ route, navigation }) {
  const { childId } = route.params;
  const [activeTab, setActiveTab] = useState('learning');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    learning: [],
    behavior: [],
    achievements: []
  });

  useEffect(() => {
    fetchProgressData();
  }, [childId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // For development, use mock data
      setProgressData(MOCK_DATA);
      
      /* Uncomment when ready to use real data
      // Fetch learning progress
      const progressRef = collection(db, 'progress_records');
      const progressQuery = query(
        progressRef,
        where('childId', '==', childId),
        orderBy('date', 'desc')
      );
      const progressSnapshot = await getDocs(progressQuery);
      const learningProgress = progressSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Fetch behavior goals
      const goalsRef = collection(db, 'behavior_goals');
      const goalsQuery = query(
        goalsRef,
        where('childId', '==', childId)
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      const behaviorGoals = goalsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Fetch achievements
      const achievementsRef = collection(db, 'achievements');
      const achievementsQuery = query(
        achievementsRef,
        where('childId', '==', childId)
      );
      const achievementsSnapshot = await getDocs(achievementsQuery);
      const achievements = achievementsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      setProgressData({
        learning: learningProgress,
        behavior: behaviorGoals,
        achievements
      });
      */
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setLoading(false);
    }
  };

  const renderLearningProgress = () => {
    const subjectProgress = progressData.learning.reduce((acc, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = [];
      }
      acc[record.subject].push({
        date: record.date,
        score: record.score
      });
      return acc;
    }, {});

    return Object.entries(subjectProgress).map(([subject, data]) => (
      <View key={subject} style={styles.progressCard}>
        <Text style={styles.subjectTitle}>{subject}</Text>
        <LineChart
          data={{
            labels: data.slice(-6).map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
              data: data.slice(-6).map(d => d.score)
            }]
          }}
          width={350}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chart}
        />
      </View>
    ));
  };

  const renderBehaviorProgress = () => (
    <View>
      {progressData.behavior.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.targetBehavior}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: goal.status === 'completed' ? '#34C759' : '#007AFF' }
            ]}>
              <Text style={styles.statusText}>{goal.status}</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(goal.currentProgress / goal.target) * 100}%` }
              ]}
            />
          </View>
          
          <View style={styles.goalStats}>
            <Text style={styles.statsText}>
              Current: {goal.currentProgress} / Target: {goal.target}
            </Text>
            <Text style={styles.statsText}>
              Start: {new Date(goal.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      {progressData.achievements.map((badge) => (
        <View key={badge.id} style={styles.badgeCard}>
          <Text style={styles.badgeEmoji}>🏆</Text>
          <Text style={styles.badgeTitle}>{badge.title}</Text>
          <Text style={styles.badgeDate}>
            {new Date(badge.dateAwarded).toLocaleDateString()}
          </Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'learning' && styles.activeTab]}
          onPress={() => setActiveTab('learning')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'learning' && styles.activeTabText
          ]}>Learning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'behavior' && styles.activeTab]}
          onPress={() => setActiveTab('behavior')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'behavior' && styles.activeTabText
          ]}>Behavior</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'achievements' && styles.activeTabText
          ]}>Achievements</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'learning' && renderLearningProgress()}
        {activeTab === 'behavior' && renderBehaviorProgress()}
        {activeTab === 'achievements' && renderAchievements()}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  progressCard: {
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
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
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
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 