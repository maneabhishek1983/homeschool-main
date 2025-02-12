// User Types
export type UserRole = 'parent' | 'tutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileSettings: {
    teachingPreferences?: string[];
    learningGoals?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends User {
  role: 'parent';
  children: string[]; // Array of child IDs
}

export interface TutorProfile extends User {
  role: 'tutor';
  qualifications: string[];
  specializations: string[];
  teachingStyle: string;
  assignedStudents: string[]; // Array of child IDs
}

// Child Profile
export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  yearGroup: 'Reception' | 'Year1' | 'Year2' | 'Year3' | 'Year4';
  currentSkillLevels: {
    [subject: string]: number; // 1-5 skill level
  };
  learningGoals: LearningGoal[];
  behaviorGoals: BehaviorGoal[];
  createdAt: Date;
  updatedAt: Date;
}

// Learning Activities
export interface Activity {
  id: string;
  title: string;
  description: string;
  subject: string;
  yearGroup: string;
  difficultyLevel: number;
  icon?: string;
  duration?: number;
  objectives: string[];
  instructionalSteps: string[];
  mediaLinks?: {
    type: 'video' | 'audio' | 'image';
    url: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ABA-Focused Activities
export interface ABAActivity extends Activity {
  targetBehavior: string;
  promptingGuidelines: {
    level: string;
    description: string;
  }[];
  reinforcementStrategy: {
    type: string;
    description: string;
  };
  measurementMethod: {
    type: 'frequency' | 'duration' | 'accuracy';
    description: string;
  };
}

// Progress Tracking
export interface LearningGoal {
  id: string;
  childId: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface BehaviorGoal {
  id: string;
  childId: string;
  targetBehavior: string;
  replacementBehavior: string;
  reinforcementMethods: string[];
  dataCollectionType: 'frequency' | 'interval' | 'duration';
  baseline: number;
  target: number;
  currentProgress: number;
  startDate: Date;
  reviewDate: Date;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Session Management
export interface Session {
  id: string;
  tutorId: string;
  childId: string;
  parentId: string;
  date: Date;
  duration: number; // in minutes
  activitiesCovered: {
    activityId: string;
    completed: boolean;
    notes?: string;
  }[];
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Progress Records
export interface ProgressRecord {
  id: string;
  childId: string;
  activityId: string;
  date: Date;
  score: number;
  behaviorData?: {
    frequency?: number;
    duration?: number;
    latency?: number;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rewards and Gamification
export interface TokenLog {
  id: string;
  childId: string;
  activityId: string;
  tokensEarned: number;
  tokensSpent: number;
  rewardRedeemed?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  childId: string;
  title: string;
  description: string;
  criteria: string;
  dateAwarded: Date;
  displayStatus: 'visible' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
} 