import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authDiagnostics from '../services/diagnostics/AuthDiagnostics';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize app first
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  authDiagnostics.logEvent({
    type: 'firebase_init',
    status: 'app_created',
    timestamp: Date.now()
  });
} else {
  app = getApps()[0];
  authDiagnostics.logEvent({
    type: 'firebase_init',
    status: 'app_reused',
    timestamp: Date.now()
  });
}

// Initialize auth with persistence
let auth;
try {
  // Always initialize with persistence first
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  authDiagnostics.logEvent({
    type: 'auth_init',
    status: 'success',
    persistence: 'async_storage',
    timestamp: Date.now()
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    authDiagnostics.logEvent({
      type: 'auth_init',
      status: 'reused',
      message: 'Using existing auth instance',
      timestamp: Date.now()
    });
  } else {
    authDiagnostics.logEvent({
      type: 'auth_init',
      status: 'error',
      error: error,
      timestamp: Date.now()
    });
    throw error;
  }
}

// Verify auth is properly initialized
if (!auth) {
  throw new Error('Failed to initialize Firebase Auth');
}

// Initialize Firestore with cache settings
const db = initializeFirestore(app, {
  cache: {
    sizeBytes: 100 * 1024 * 1024, // 100MB cache size
    lruParams: {
      maxEntries: 1000
    }
  }
});

authDiagnostics.logEvent({
  type: 'firestore_init',
  status: 'success',
  cache: 'enabled',
  timestamp: Date.now()
});

// Log final initialization status
authDiagnostics.logEvent({
  type: 'firebase_init',
  status: 'complete',
  components: {
    app: !!app,
    auth: !!auth,
    db: !!db
  },
  timestamp: Date.now()
});

export { app, auth, db }; 