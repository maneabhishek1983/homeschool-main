import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeAI } from './src/services/ai/initializeAI';
import { AppRegistry } from 'react-native';
import { getStorybookUI } from '@storybook/react-native';

import './.storybook';

const StorybookUIRoot = getStorybookUI({});

AppRegistry.registerComponent('homeschool-hub', () => StorybookUIRoot);

export default function App() {
  useEffect(() => {
    initializeAI().catch(error => {
      console.error('Failed to initialize AI system:', error);
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
