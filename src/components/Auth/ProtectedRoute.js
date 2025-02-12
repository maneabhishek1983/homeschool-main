import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.replace('Auth');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return isAuthenticated ? children : null;
} 