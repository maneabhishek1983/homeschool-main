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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>Homeschool Hub</Text>
          <Text style={styles.subtitleText}>Your complete homeschooling companion</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.quickLinkIcon}>👤</Text>
              <Text style={styles.quickLinkText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('AddChild')}
            >
              <Text style={styles.quickLinkIcon}>➕</Text>
              <Text style={styles.quickLinkText}>Add Child</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('Tasks')}
            >
              <Text style={styles.quickLinkIcon}>📋</Text>
              <Text style={styles.quickLinkText}>Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLink}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Text style={styles.quickLinkIcon}>📅</Text>
              <Text style={styles.quickLinkText}>Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentActivities}
          >
            <TouchableOpacity style={styles.activityCard}>
              <Text style={styles.activityIcon}>📝</Text>
              <Text style={styles.activityTitle}>Math Homework</Text>
              <Text style={styles.activityMeta}>Emma • 2h ago</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.activityCard}>
              <Text style={styles.activityIcon}>📚</Text>
              <Text style={styles.activityTitle}>Reading Session</Text>
              <Text style={styles.activityMeta}>Noah • 3h ago</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.activityCard}>
              <Text style={styles.activityIcon}>🔬</Text>
              <Text style={styles.activityTitle}>Science Project</Text>
              <Text style={styles.activityMeta}>Emma • 5h ago</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <View style={styles.upcomingTasks}>
            <TouchableOpacity style={styles.taskCard}>
              <Text style={styles.taskIcon}>📜</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>History Essay</Text>
                <Text style={styles.taskMeta}>Due Tomorrow • Emma</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskCard}>
              <Text style={styles.taskIcon}>🔢</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>Math Quiz</Text>
                <Text style={styles.taskMeta}>Due in 2 days • Noah</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.taskCard}>
              <Text style={styles.taskIcon}>📖</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>Literature Review</Text>
                <Text style={styles.taskMeta}>Due Next Week • Emma</Text>
              </View>
            </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#4169E1',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  quickLink: {
    width: (SCREEN_WIDTH - 80) / 4,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  recentActivities: {
    paddingRight: 20,
  },
  activityCard: {
    width: SCREEN_WIDTH * 0.4,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  activityMeta: {
    fontSize: 12,
    color: '#666',
  },
  upcomingTasks: {
    marginTop: 5,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 12,
    color: '#666',
  },
}); 