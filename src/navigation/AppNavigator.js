import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HomeScreen from '../screens/HomeScreen';
import ParentProfileScreen from '../screens/ParentProfileScreen';
import TasksScreen from '../screens/TasksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import ActivityDetailsScreen from '../screens/ActivityDetailsScreen';
import CreateActivityScreen from '../screens/CreateActivityScreen';
import LearningPathScreen from '../screens/LearningPathScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import UnitDetailsScreen from '../screens/UnitDetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{color}}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{color}}>📚</Text>,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{color}}>📋</Text>,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ParentProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{color}}>👤</Text>,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{color}}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useSelector(state => state.auth);
  const isAuthenticated = !!user;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="ActivityDetails"
        component={ActivityDetailsScreen}
        options={{ title: 'Activity Details' }}
      />
      <Stack.Screen
        name="CreateActivity"
        component={CreateActivityScreen}
        options={{ title: 'Create Activity' }}
      />
      <Stack.Screen
        name="LearningPath"
        component={LearningPathScreen}
        options={{ title: 'Learning Path' }}
      />
      <Stack.Screen
        name="ProgressTracking"
        component={ProgressTrackingScreen}
        options={{ title: 'Progress Tracking' }}
      />
      <Stack.Screen
        name="UnitDetails"
        component={UnitDetailsScreen}
        options={{ title: 'Unit Details' }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
      />
    </Stack.Navigator>
  );
}