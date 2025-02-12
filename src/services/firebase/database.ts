import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { 
  User, ParentProfile, TutorProfile, ChildProfile, 
  Activity, ABAActivity, LearningGoal, BehaviorGoal,
  Session, ProgressRecord, TokenLog, Badge 
} from '../models/types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  CHILDREN: 'children',
  ACTIVITIES: 'activities',
  ABA_ACTIVITIES: 'aba_activities',
  LEARNING_GOALS: 'learning_goals',
  BEHAVIOR_GOALS: 'behavior_goals',
  SESSIONS: 'sessions',
  PROGRESS_RECORDS: 'progress_records',
  TOKEN_LOGS: 'token_logs',
  BADGES: 'badges',
};

// Generic CRUD operations
async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
}

async function getCollection<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
}

async function addDocument<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
}

// User operations
export const userService = {
  async getUser(id: string): Promise<User | null> {
    return getDocument<User>(COLLECTIONS.USERS, id);
  },

  async createParentProfile(data: Omit<ParentProfile, 'id'>): Promise<string> {
    return addDocument<ParentProfile>(COLLECTIONS.USERS, data);
  },

  async createTutorProfile(data: Omit<TutorProfile, 'id'>): Promise<string> {
    return addDocument<TutorProfile>(COLLECTIONS.USERS, data);
  },

  async updateProfile(id: string, data: Partial<User>): Promise<void> {
    await updateDocument<User>(COLLECTIONS.USERS, id, data);
  },
};

// Child operations
export const childService = {
  async getChild(id: string): Promise<ChildProfile | null> {
    return getDocument<ChildProfile>(COLLECTIONS.CHILDREN, id);
  },

  async getChildrenByParent(parentId: string): Promise<ChildProfile[]> {
    const q = query(collection(db, COLLECTIONS.CHILDREN), where('parentId', '==', parentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ChildProfile);
  },

  async createChild(data: Omit<ChildProfile, 'id'>): Promise<string> {
    return addDocument<ChildProfile>(COLLECTIONS.CHILDREN, data);
  },

  async updateChild(id: string, data: Partial<ChildProfile>): Promise<void> {
    await updateDocument<ChildProfile>(COLLECTIONS.CHILDREN, id, data);
  },
};

// Activity operations
export const activityService = {
  async getActivity(id: string): Promise<Activity | null> {
    return getDocument<Activity>(COLLECTIONS.ACTIVITIES, id);
  },

  async getActivitiesByYearGroup(yearGroup: string): Promise<Activity[]> {
    const q = query(collection(db, COLLECTIONS.ACTIVITIES), where('yearGroups', 'array-contains', yearGroup));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Activity);
  },

  async createActivity(data: Omit<Activity, 'id'>): Promise<string> {
    return addDocument<Activity>(COLLECTIONS.ACTIVITIES, data);
  },

  async createABAActivity(data: Omit<ABAActivity, 'id'>): Promise<string> {
    return addDocument<ABAActivity>(COLLECTIONS.ABA_ACTIVITIES, data);
  },
};

// Progress tracking operations
export const progressService = {
  async createProgressRecord(data: Omit<ProgressRecord, 'id'>): Promise<string> {
    return addDocument<ProgressRecord>(COLLECTIONS.PROGRESS_RECORDS, data);
  },

  async getChildProgress(childId: string): Promise<ProgressRecord[]> {
    const q = query(collection(db, COLLECTIONS.PROGRESS_RECORDS), where('childId', '==', childId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProgressRecord);
  },

  async addLearningGoal(data: Omit<LearningGoal, 'id'>): Promise<string> {
    return addDocument<LearningGoal>(COLLECTIONS.LEARNING_GOALS, data);
  },

  async addBehaviorGoal(data: Omit<BehaviorGoal, 'id'>): Promise<string> {
    return addDocument<BehaviorGoal>(COLLECTIONS.BEHAVIOR_GOALS, data);
  },
};

// Session operations
export const sessionService = {
  async createSession(data: Omit<Session, 'id'>): Promise<string> {
    return addDocument<Session>(COLLECTIONS.SESSIONS, data);
  },

  async getChildSessions(childId: string): Promise<Session[]> {
    const q = query(collection(db, COLLECTIONS.SESSIONS), where('childId', '==', childId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Session);
  },

  async updateSessionStatus(id: string, status: Session['status']): Promise<void> {
    await updateDocument<Session>(COLLECTIONS.SESSIONS, id, { status });
  },
};

// Rewards operations
export const rewardsService = {
  async addTokens(data: Omit<TokenLog, 'id'>): Promise<string> {
    return addDocument<TokenLog>(COLLECTIONS.TOKEN_LOGS, data);
  },

  async getChildTokens(childId: string): Promise<TokenLog[]> {
    const q = query(collection(db, COLLECTIONS.TOKEN_LOGS), where('childId', '==', childId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as TokenLog);
  },

  async awardBadge(data: Omit<Badge, 'id'>): Promise<string> {
    return addDocument<Badge>(COLLECTIONS.BADGES, data);
  },

  async getChildBadges(childId: string): Promise<Badge[]> {
    const q = query(collection(db, COLLECTIONS.BADGES), where('childId', '==', childId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Badge);
  },
}; 