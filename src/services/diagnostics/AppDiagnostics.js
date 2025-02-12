class AppDiagnostics {
  constructor() {
    this.issues = [];
    this.fixes = new Map();
    this.setupFixStrategies();
  }

  setupFixStrategies() {
    // Redux Toolkit Issues
    this.fixes.set('REDUX_TOOLKIT_UNDEFINED', {
      detect: (error) => error.includes('createSlice is not a function') || error.includes('_toolkit.createSlice is undefined'),
      fix: async () => ({
        type: 'REDUX_TOOLKIT',
        description: 'Redux Toolkit initialization issue detected. This is likely due to incorrect imports or module resolution.',
        commands: [
          'npm install @reduxjs/toolkit react-redux',
          'watchman watch-del-all',
          'rm -rf $TMPDIR/metro-*',
          'npm start -- --reset-cache'
        ],
        codeChanges: [
          {
            file: 'src/store/slices/authSlice.js',
            description: 'Update auth slice imports and exports',
            code: `
// Change from CommonJS to ES6 imports
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {
    // ... your reducers
  }
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;`
          },
          {
            file: 'src/store/store.js',
            description: 'Update store configuration',
            code: `
// Change to ES6 imports
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activitiesReducer from './slices/activitiesSlice';
import syllabusReducer from './slices/syllabusSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitiesReducer,
    syllabus: syllabusReducer
  }
});

export default store;`
          }
        ],
        checkList: [
          'Ensure @reduxjs/toolkit is properly installed',
          'Check for consistent use of either ES6 or CommonJS imports',
          'Verify store configuration imports all reducers correctly',
          'Clear Metro bundler cache after making changes'
        ]
      })
    });

    // App Registration Issues
    this.fixes.set('APP_REGISTRATION_ERROR', {
      detect: (error) => error.includes('"main" has not been registered'),
      fix: async () => ({
        type: 'APP_REGISTRATION',
        description: 'App registration issue detected. This usually happens when the app entry point is not properly configured.',
        commands: [
          'watchman watch-del-all',
          'rm -rf $TMPDIR/metro-*',
          'npm start -- --reset-cache'
        ],
        codeChanges: [
          {
            file: 'index.js',
            description: 'Update app registration in index.js',
            code: `
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);`
          },
          {
            file: 'App.js',
            description: 'Update App.js exports and registration',
            code: `
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;`
          }
        ],
        checkList: [
          'Verify app.json contains the correct app name',
          'Ensure index.js is the entry point in package.json',
          'Check for circular dependencies',
          'Make sure all imports resolve correctly'
        ]
      })
    });

    // Firebase Issues
    this.fixes.set('FIREBASE_CONFIG_ERROR', {
      detect: (error) => error.includes('Firebase') && error.includes('initialization error'),
      fix: async () => ({
        type: 'FIREBASE_CONFIG',
        description: 'Firebase configuration issue detected',
        commands: [
          'npm install firebase @react-native-firebase/app @react-native-firebase/auth',
          'npx expo install @react-native-async-storage/async-storage'
        ],
        checkList: [
          'Verify Firebase configuration in .env file',
          'Check Firebase app initialization in src/config/firebase.js',
          'Ensure all required Firebase modules are installed'
        ]
      })
    });

    // Module Resolution Issues
    this.fixes.set('MODULE_NOT_FOUND', {
      detect: (error) => error.includes('Unable to resolve module'),
      fix: async () => ({
        type: 'MODULE_RESOLUTION',
        description: 'Module resolution issue detected',
        commands: [
          'npm install',
          'watchman watch-del-all',
          'rm -rf $TMPDIR/metro-*',
          'npm start -- --reset-cache'
        ],
        checkList: [
          'Verify the module is listed in package.json',
          'Check for typos in import statements',
          'Ensure the module is compatible with React Native'
        ]
      })
    });
  }

  async diagnose(error) {
    console.log('🔍 Starting diagnostics...', error);
    this.issues = [];

    for (const [issueType, strategy] of this.fixes.entries()) {
      if (strategy.detect(error)) {
        console.log('🎯 Detected issue:', issueType);
        this.issues.push(issueType);
      }
    }

    if (this.issues.length === 0) {
      console.log('❓ No known issues detected, providing general recommendations');
      return {
        type: 'UNKNOWN_ERROR',
        description: 'Unknown error detected. Here are some general troubleshooting steps:',
        error: error.toString(),
        recommendations: [
          'Check the error message for specific details',
          'Review recent code changes',
          'Verify all dependencies are properly installed',
          'Try clearing the Metro bundler cache',
          'Check for consistent use of ES6 or CommonJS imports'
        ],
        commands: [
          'npm install',
          'watchman watch-del-all',
          'rm -rf $TMPDIR/metro-*',
          'npm start -- --reset-cache'
        ]
      };
    }

    return this.generateFixPlan();
  }

  async generateFixPlan() {
    let allFixes = {
      description: 'Multiple issues detected. Here are the suggested fixes:',
      commands: [],
      recommendations: [],
      codeChanges: []
    };

    for (const issue of this.issues) {
      const strategy = this.fixes.get(issue);
      if (strategy) {
        const fix = await strategy.fix();
        if (fix.commands) {
          allFixes.commands.push(...fix.commands);
        }
        if (fix.recommendations) {
          allFixes.recommendations.push(...fix.recommendations);
        }
        if (fix.codeChanges) {
          allFixes.codeChanges.push(...fix.codeChanges);
        }
        if (fix.checkList) {
          allFixes.recommendations.push(...fix.checkList);
        }
      }
    }

    // Remove duplicates
    allFixes.commands = [...new Set(allFixes.commands)];
    allFixes.recommendations = [...new Set(allFixes.recommendations)];

    console.log('📋 Generated fix plan:', allFixes);
    return allFixes;
  }

  getErrorSolution(error) {
    return this.diagnose(error);
  }
}

// Create and export a singleton instance
const diagnostics = new AppDiagnostics();
module.exports = diagnostics; 