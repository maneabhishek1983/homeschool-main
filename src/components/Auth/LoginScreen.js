import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../../config/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import NetInfo from '@react-native-community/netinfo';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleAnonymousLogin = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const userCredential = await signInAnonymously(auth);
      console.log('Anonymous login successful:', userCredential.user.uid);
      
      // Update Redux store with anonymous user data
      dispatch(setUser({
        uid: userCredential.user.uid,
        isAnonymous: true,
        email: null,
        profileCompleted: true // Set to true to skip profile setup
      }));
      
    } catch (error) {
      console.error('Anonymous login error:', error);
      Alert.alert(
        'Login Error',
        'Unable to login anonymously. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isOnline) {
      Alert.alert('Error', 'No internet connection. Please check your network and try again.');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      dispatch(setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAnonymous: false,
        emailVerified: userCredential.user.emailVerified,
        profileCompleted: true // Set to true to skip profile setup
      }));

      setEmail('');
      setPassword('');
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login';
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        default:
          if (error.message.includes('offline')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          }
      }
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      
      {!isOnline && (
        <Text style={styles.offlineMessage}>
          You are currently offline. Some features may be limited.
        </Text>
      )}

      {!showEmailLogin ? (
        <>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAnonymousLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Continue as Guest</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowEmailLogin(true)}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>
              Sign in with Email
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowEmailLogin(false)}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Guest Login
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerText}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  offlineMessage: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;