export const handleFirebaseError = (error) => {
  switch (error.code) {
    // Authentication errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please try again.';
    case 'auth/email-not-verified':
      return 'Please verify your email address before logging in.';
    
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This record already exists.';
    
    // Generic errors
    case 'cancelled':
      return 'The operation was cancelled.';
    case 'unknown':
      return 'An unknown error occurred. Please try again.';
    case 'invalid-argument':
      return 'Invalid input provided. Please check your data.';
    case 'deadline-exceeded':
      return 'The operation timed out. Please try again.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    case 'failed-precondition':
      return 'The operation failed. Please try again.';
    case 'aborted':
      return 'The operation was aborted. Please try again.';
    case 'out-of-range':
      return 'Operation out of range.';
    case 'unimplemented':
      return 'This feature is not available.';
    case 'internal':
      return 'An internal error occurred. Please try again.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    case 'data-loss':
      return 'Critical data loss occurred. Please contact support.';
    case 'unauthenticated':
      return 'Please log in to continue.';
    
    default:
      console.error('Unhandled Firebase error:', error);
      return 'An unexpected error occurred. Please try again later.';
  }
}; 