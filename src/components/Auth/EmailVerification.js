import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../../store/slices/authSlice';
import { globalStyles } from '../../styles/global';

const EmailVerification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleResendVerification = async () => {
    try {
      // Add your email verification logic here
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Verify Your Email</Text>
      <Text style={styles.message}>
        Please check your email and verify your account to continue.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleResendVerification}>
        <Text style={styles.buttonText}>Resend Verification Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmailVerification; 