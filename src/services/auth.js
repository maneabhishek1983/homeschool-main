import { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import store from '../store/store';
import { setUser, setLoading, setError, clearUser } from '../store/slices/authSlice';
import authDiagnostics from './diagnostics/AuthDiagnostics';
import { trackScreenView, trackFeatureUsage, trackUserAction, generateAIReport } from './src/services/ai/initializeAI';

let authStateUnsubscribe = null;
let authListenerSetup = false;
let isInitialized = false;

const serializeUser = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }
  };
};

const handleAuthStateChange = (user) => {
  if (!isInitialized) return; // Skip until initialization is complete
  
  try {
    if (user) {
      const serializedUser = serializeUser(user);
      store.dispatch(setUser(serializedUser));
      authDiagnostics.logEvent({
        type: 'auth_state_change',
        status: 'authenticated',
        user: serializedUser,
        timestamp: Date.now()
      });
    } else {
      store.dispatch(clearUser());
      authDiagnostics.logEvent({
        type: 'auth_state_change',
        status: 'signed_out',
        timestamp: Date.now()
      });
    }
  } catch (error) {
    authDiagnostics.logError(error);
    store.dispatch(setError(error));
  }
};

export const setupAuthListener = () => {
  if (authListenerSetup) return;

  cleanup();
  authListenerSetup = true;

  try {
    authStateUnsubscribe = auth.onAuthStateChanged(handleAuthStateChange, (error) => {
      authDiagnostics.logError(error);
      store.dispatch(setError(error));
    });
    return authStateUnsubscribe;
  } catch (error) {
    authDiagnostics.logError(error);
    throw error;
  }
};

// Initialize auth state - call this once when app starts
export const initializeAuth = async () => {
  if (isInitialized) return;
  
  try {
    store.dispatch(setLoading(true));
    setupAuthListener();

    // Check for existing user
    if (auth.currentUser) {
      const serializedUser = serializeUser(auth.currentUser);
      store.dispatch(setUser(serializedUser));
      authDiagnostics.logEvent({
        type: 'auth_init',
        status: 'existing_user',
        user: serializedUser,
        timestamp: Date.now()
      });
    } else {
      // Create anonymous user silently
      const result = await signInAnonymously(auth);
      const serializedUser = serializeUser(result.user);
      store.dispatch(setUser(serializedUser));
      authDiagnostics.logEvent({
        type: 'auth_init',
        status: 'created_anonymous',
        user: serializedUser,
        timestamp: Date.now()
      });
    }
  } catch (error) {
    authDiagnostics.logError(error);
    store.dispatch(setError(error));
  } finally {
    isInitialized = true;
    store.dispatch(setLoading(false));
  }
};

export const cleanup = () => {
  if (authStateUnsubscribe) {
    authStateUnsubscribe();
    authStateUnsubscribe = null;
    authListenerSetup = false;
    isInitialized = false;
    authDiagnostics.reset();
  }
};

// In your screens/components:
trackScreenView('HomeScreen');
trackFeatureUsage('AddChild');
trackUserAction('ButtonClick'); 

const report = await generateAIReport();
console.log(report); 