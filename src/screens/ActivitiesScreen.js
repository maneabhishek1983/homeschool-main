import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivitiesByYearGroup } from '../store/slices/activitiesSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const yearGroups = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];
const subjects = ['Math', 'English', 'Science', 'History', 'Geography', 'Art'];

export default function ActivitiesScreen({ navigation }) {
  const dispatch = useDispatch();
  const [selectedYearGroup, setSelectedYearGroup] = useState('Year 1');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  
  const activities = useSelector(state => state.activities.items) || [];
  const loading = useSelector(state => state.activities.loading);
  const error = useSelector(state => state.activities.error);

  useEffect(() => {
    dispatch(fetchActivitiesByYearGroup(selectedYearGroup));
  }, [dispatch, selectedYearGroup]);

  const filteredActivities = activities.filter(activity => 
    selectedSubject === 'All' || activity.subject === selectedSubject
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchActivitiesByYearGroup(selectedYearGroup));
    setRefreshing(false);
  };

  const renderActivityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => navigation.navigate('ActivityDetails', { activity: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.activityIcon}>{item.icon || '📚'}</Text>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activitySubject}>{item.subject}</Text>
        </View>
      </View>
      <Text style={styles.activityDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.duration}>{item.duration || '30'} min</Text>
        <Text style={styles.difficulty}>Level {item.difficultyLevel}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderYearGroup = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedYearGroup === item && styles.filterButtonSelected,
      ]}
      onPress={() => setSelectedYearGroup(item)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedYearGroup === item && styles.filterButtonTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderSubject = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedSubject === item && styles.filterButtonSelected,
      ]}
      onPress={() => setSelectedSubject(item)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedSubject === item && styles.filterButtonTextSelected,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchActivitiesByYearGroup(selectedYearGroup))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No activities found for the selected filters
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => setSelectedSubject('All')}
      >
        <Text style={styles.retryButtonText}>Show All Activities</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            data={yearGroups}
            renderItem={renderYearGroup}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
          />
          <FlatList
            horizontal
            data={['All', ...subjects]}
            renderItem={renderSubject}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
          />
        </View>

        <FlatList
          data={filteredActivities}
          renderItem={renderActivityCard}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.activitiesList,
            filteredActivities.length === 0 && styles.emptyList
          ]}
          showsVerticalScrollIndicator={true}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyList: {
    flexGrow: 1,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  filterList: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  activitiesList: {
    padding: 15,
    flexGrow: 1,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitleContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubject: {
    fontSize: 14,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  difficulty: {
    fontSize: 14,
    color: '#007AFF',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 