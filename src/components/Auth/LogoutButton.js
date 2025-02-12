import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/slices/authSlice';
import { firebaseService } from '../../services/firebase';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await firebaseService.logoutUser();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
}); 