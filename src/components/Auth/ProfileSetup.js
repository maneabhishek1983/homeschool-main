import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { db, auth } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { setUser } from '../../store/slices/authSlice';
import { Picker } from '@react-native-picker/picker';

export default function ProfileSetup({ navigation }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    role: 'parent',
  });

  const handleSubmit = async () => {
    if (!profile.fullName || !profile.role) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        fullName: profile.fullName,
        role: profile.role,
        isAnonymous: currentUser.isAnonymous,
        profileCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update Firestore
      await setDoc(doc(db, 'users', currentUser.uid), userData);
      console.log('Profile updated successfully');

      // Update Redux store
      dispatch(setUser(userData));

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert(
        'Error',
        'Failed to save profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profile.fullName}
        onChangeText={(text) => setProfile(prev => ({ ...prev, fullName: text }))}
        editable={!isLoading}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>I am a:</Text>
        <Picker
          selectedValue={profile.role}
          onValueChange={(value) => setProfile(prev => ({ ...prev, role: value }))}
          enabled={!isLoading}
          style={styles.picker}
        >
          <Picker.Item label="Parent" value="parent" />
          <Picker.Item label="Tutor" value="tutor" />
          <Picker.Item label="Student" value="student" />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Complete Setup</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
