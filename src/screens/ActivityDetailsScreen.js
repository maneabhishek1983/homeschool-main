import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ActivityDetailsScreen({ route, navigation }) {
  const { activity } = route.params || {};

  if (!activity) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Activity not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
        scrollEnabled={true}
      >
        <View style={styles.contentHeader}>
          <Text style={styles.icon}>{activity.icon || '📚'}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{activity.title}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.subject}>{activity.subject}</Text>
              <Text style={styles.duration}>{activity.duration || '30'} min</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Objectives</Text>
          <View style={styles.objectivesList}>
            {(activity.objectives || []).map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Year Group</Text>
              <Text style={styles.detailValue}>{activity.yearGroup}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Difficulty</Text>
              <Text style={styles.detailValue}>Level {activity.difficultyLevel}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Subject</Text>
              <Text style={styles.detailValue}>{activity.subject}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{activity.duration || '30'} min</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timesheet</Text>
          <View style={styles.timesheetContainer}>
            <View style={styles.timesheetRow}>
              <Text style={styles.timesheetLabel}>Start Time</Text>
              <Text style={styles.timesheetValue}>{activity.startTime || 'Not started'}</Text>
            </View>
            <View style={styles.timesheetRow}>
              <Text style={styles.timesheetLabel}>End Time</Text>
              <Text style={styles.timesheetValue}>{activity.endTime || 'Not completed'}</Text>
            </View>
            <View style={styles.timesheetRow}>
              <Text style={styles.timesheetLabel}>Total Duration</Text>
              <Text style={styles.timesheetValue}>{activity.totalDuration || '0'} minutes</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  icon: {
    fontSize: 40,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subject: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 10,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  objectivesList: {
    marginTop: 5,
  },
  objectiveItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    marginTop: 2,
  },
  objectiveText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timesheetContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
  },
  timesheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timesheetLabel: {
    fontSize: 14,
    color: '#666',
  },
  timesheetValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
}); 