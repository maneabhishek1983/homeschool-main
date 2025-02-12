import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Platform } from 'react-native';
import { Calendar, CalendarProvider, ExpandableCalendar, AgendaList } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const DEBUG = __DEV__;

const today = new Date().toISOString().split('T')[0];

// Mock data - replace with real data from your backend
const mockEvents = {
  [today]: [
    { id: '1', title: 'Math Test', child: 'Emma', time: '09:00 AM', type: 'assessment' },
    { id: '2', title: 'Reading Session', child: 'Noah', time: '11:00 AM', type: 'activity' },
  ],
  [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: [
    { id: '3', title: 'Science Project', child: 'Emma', time: '10:00 AM', type: 'project' },
  ],
};

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState(mockEvents);

  const onDayPress = useCallback((day) => {
    if (DEBUG) console.log('Selected day:', day);
    setSelectedDate(day.dateString);
  }, []);

  const renderItem = useCallback(({ item }) => {
    const getEventColor = (type) => {
      switch (type) {
        case 'assessment':
          return '#FF9500';
        case 'activity':
          return '#34C759';
        case 'project':
          return '#007AFF';
        default:
          return '#8E8E93';
      }
    };

    return (
      <TouchableOpacity
        style={[styles.eventCard, { borderLeftColor: getEventColor(item.type) }]}
        onPress={() => {
          if (item.type === 'assessment') {
            navigation.navigate('TaskDetails', { task: item });
          } else {
            navigation.navigate('ActivityDetails', { activity: item });
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTime}>{item.time}</Text>
          <Text style={styles.eventType}>{item.type}</Text>
        </View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventChild}>{item.child}</Text>
      </TouchableOpacity>
    );
  }, [navigation]);

  const renderEmptyDate = useCallback(() => (
    <View style={styles.emptyDate}>
      <Text style={styles.emptyDateText}>No events scheduled</Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <CalendarProvider date={selectedDate}>
        <ExpandableCalendar
          firstDay={1}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#007AFF' },
            ...Object.keys(events).reduce((acc, date) => ({
              ...acc,
              [date]: { marked: true, dotColor: '#007AFF' }
            }), {})
          }}
          onDayPress={onDayPress}
          theme={{
            calendarBackground: '#fff',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#fff',
            todayTextColor: '#007AFF',
            textDisabledColor: '#d9e1e8',
          }}
        />
        <View style={styles.agendaContainer}>
          <FlatList
            data={events[selectedDate] || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyDate}
            contentContainerStyle={styles.eventsList}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        </View>
      </CalendarProvider>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateActivity')}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  agendaContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  eventsList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  eventType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventChild: {
    fontSize: 14,
    color: '#666',
  },
  emptyDate: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
  emptyDateText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -2,
  },
}); 