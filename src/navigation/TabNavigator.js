import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// Import components
import DashboardScreen from '../components/Parent/DashboardScreen';
import ChildProgressTracker from '../components/Parent/ChildProgressTracker';
import TaskManagement from '../components/Parent/TaskManagement';
import TutorTimesheet from '../components/Parent/TutorTimesheet';
import Messaging from '../components/Communication/Messaging';
import Calendar from '../components/Scheduling/Calendar';
import SyllabusEditor from '../components/Syllabus/SyllabusEditor';
import InteractiveLearning from '../components/Learning/InteractiveLearning';
import BehaviorTracking from '../components/ABA/BehaviorTracking';
import DiscreteTrialTeaching from '../components/ABA/DiscreteTrialTeaching';
import BehaviorPlan from '../components/ABA/BehaviorPlan';

const Tab = createBottomTabNavigator();

// Wrapper components
const BehaviorTrackingWrapper = () => {
  const selectedChild = useSelector(state => state.children?.selectedChild);
  return selectedChild ? <BehaviorTracking childId={selectedChild} /> : null;
};

const DTTWrapper = () => {
  const selectedChild = useSelector(state => state.children?.selectedChild);
  return selectedChild ? <DiscreteTrialTeaching childId={selectedChild} /> : null;
};

const BehaviorPlanWrapper = () => {
  const selectedChild = useSelector(state => state.children?.selectedChild);
  return selectedChild ? <BehaviorPlan childId={selectedChild} /> : null;
};

export default function TabNavigator() {
  const user = useSelector(state => state.auth?.user);
  const role = user?.role || 'parent';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Progress':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Tasks':
              iconName = focused ? 'list-circle' : 'list-circle-outline';
              break;
            case 'Timesheet':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Syllabus':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Learning':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Behavior':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'Trials':
              iconName = focused ? 'clipboard' : 'clipboard-outline';
              break;
            case 'Plans':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            default:
              iconName = 'ellipsis-horizontal';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Progress" component={ChildProgressTracker} />
      <Tab.Screen name="Tasks" component={TaskManagement} />
      <Tab.Screen name="Timesheet" component={TutorTimesheet} />
      <Tab.Screen name="Messages" component={Messaging} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Syllabus" component={SyllabusEditor} />
      <Tab.Screen name="Learning" component={InteractiveLearning} />
      <Tab.Screen name="Behavior" component={BehaviorTrackingWrapper} />
      <Tab.Screen name="Trials" component={DTTWrapper} />
      <Tab.Screen name="Plans" component={BehaviorPlanWrapper} />
    </Tab.Navigator>
  );
}