import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const firebaseService = {
  // Register new user
  registerUser: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: user.emailVerified,
        profileCompleted: false
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, data) => {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, updateData, { merge: true });
      return await getDoc(userRef);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login timestamp
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get user data
  getUserData: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Get user data error:', error);
      throw error;
    }
  },

  // Logout user
  logoutUser: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}; 