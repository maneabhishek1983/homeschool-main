class AuthDiagnostics {
  constructor() {
    this.eventHistory = [];
    this.maxHistoryLength = 100;
    this.authAttempts = new Map();
    this.authStateChanges = new Map();
    this.duplicateCount = 0;
  }

  logEvent(event) {
    const timestamp = Date.now();
    const timeFormatted = new Date(timestamp).toISOString();
    const enrichedEvent = { ...event, timestamp, timeFormatted };

    // Track auth attempts and state changes
    if (event.type === 'auth_attempt') {
      this.trackAuthAttempt(enrichedEvent);
    } else if (event.type.startsWith('auth_state_change')) {
      this.trackAuthStateChange(enrichedEvent);
    }

    // Keep history of recent events
    this.eventHistory.push(enrichedEvent);
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.shift();
    }

    // Log the event
    console.log('[Auth Diagnostics] Event:', JSON.stringify(enrichedEvent));
    return enrichedEvent;
  }

  logError(error) {
    const errorEvent = {
      type: 'error',
      error: {
        code: error.code,
        message: error.message,
        stack: error.stack
      },
      timestamp: Date.now()
    };
    console.error('[Auth Diagnostics] Error:', JSON.stringify(errorEvent));
    return errorEvent;
  }

  trackAuthAttempt(event) {
    if (event.status === 'started') {
      // Check for recent attempts
      const recentAttempts = Array.from(this.authAttempts.values())
        .filter(attempt => attempt.timestamp > Date.now() - 5000);

      if (recentAttempts.length > 0) {
        this.duplicateCount++;
        console.warn(`[Auth Diagnostics] Warning: Duplicate auth attempt detected (${this.duplicateCount} occurrences)`);
        console.warn('[Auth Diagnostics] Recent attempts:', JSON.stringify(recentAttempts));
        throw new Error('Duplicate auth attempt detected');
      }
    }

    this.authAttempts.set(event.attemptId, event);
    // Clean up old attempts
    this.cleanupOldEntries(this.authAttempts);
  }

  trackAuthStateChange(event) {
    if (event.type === 'auth_state_change_start') {
      // Check for concurrent state changes
      const activeChanges = Array.from(this.authStateChanges.values())
        .filter(change => !change.complete && change.timestamp > Date.now() - 5000);

      if (activeChanges.length > 0) {
        console.warn('[Auth Diagnostics] Warning: Concurrent auth state change detected');
        console.warn('[Auth Diagnostics] Active changes:', JSON.stringify(activeChanges));
      }
    }

    this.authStateChanges.set(event.changeId, {
      ...event,
      complete: event.type === 'auth_state_change_complete'
    });
    // Clean up old state changes
    this.cleanupOldEntries(this.authStateChanges);
  }

  cleanupOldEntries(map) {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, value] of map.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        map.delete(key);
      }
    }
  }

  getDuplicateCount() {
    return this.duplicateCount;
  }

  getRecentEvents(count = 10) {
    return this.eventHistory.slice(-count);
  }

  getActiveAuthAttempts() {
    return Array.from(this.authAttempts.values())
      .filter(attempt => attempt.timestamp > Date.now() - 5000);
  }

  getActiveStateChanges() {
    return Array.from(this.authStateChanges.values())
      .filter(change => !change.complete && change.timestamp > Date.now() - 5000);
  }

  reset() {
    this.eventHistory = [];
    this.authAttempts.clear();
    this.authStateChanges.clear();
    this.duplicateCount = 0;
    console.log('[Auth Diagnostics] Reset completed');
  }
}

// Create a singleton instance
const authDiagnostics = new AuthDiagnostics();
export default authDiagnostics; 