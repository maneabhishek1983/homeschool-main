import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppDiagnosticsAgent {
  constructor() {
    this.diagnosticLogs = [];
    this.errorPatterns = {
      NAVIGATION: /undefined is not an object \(evaluating.*navigation\)/,
      REDUX: /undefined is not an object \(evaluating.*dispatch\)/,
      FIREBASE: /Firebase: Error \(auth\/.*\)/,
      RENDER: /undefined is not an object \(evaluating.*render\)/,
      NETWORK: /Network request failed/,
    };
  }

  async initialize() {
    try {
      // Load previous diagnostic logs
      const savedLogs = await AsyncStorage.getItem('diagnosticLogs');
      if (savedLogs) {
        this.diagnosticLogs = JSON.parse(savedLogs);
      }
      
      // Set up error boundary monitoring
      this.setupErrorMonitoring();
      
      console.log('AppDiagnosticsAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AppDiagnosticsAgent:', error);
    }
  }

  setupErrorMonitoring() {
    // Global error handler
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    
    global.ErrorUtils.setGlobalHandler(async (error, isFatal) => {
      await this.handleError(error, isFatal);
      originalHandler(error, isFatal);
    });
  }

  async handleError(error, isFatal = false) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      isFatal,
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version,
        // Add other relevant device info
      }
    };

    // Analyze error pattern
    const errorType = this.analyzeErrorPattern(error.message);
    errorInfo.type = errorType;

    // Add to logs
    this.diagnosticLogs.unshift(errorInfo);
    if (this.diagnosticLogs.length > 100) {
      this.diagnosticLogs.pop(); // Keep only last 100 logs
    }

    // Save logs
    await AsyncStorage.setItem('diagnosticLogs', JSON.stringify(this.diagnosticLogs));

    // Get solution
    const solution = this.getSolution(errorType, error.message);
    return { errorInfo, solution };
  }

  analyzeErrorPattern(errorMessage) {
    for (const [type, pattern] of Object.entries(this.errorPatterns)) {
      if (pattern.test(errorMessage)) {
        return type;
      }
    }
    return 'UNKNOWN';
  }

  getSolution(errorType, errorMessage) {
    const solutions = {
      NAVIGATION: {
        title: 'Navigation Error',
        steps: [
          'Check if the screen is registered in the navigator',
          'Verify navigation prop is passed correctly',
          'Ensure the component is wrapped in NavigationContainer'
        ]
      },
      REDUX: {
        title: 'Redux Error',
        steps: [
          'Verify store configuration',
          'Check if component is wrapped in Provider',
          'Ensure correct usage of useDispatch/useSelector'
        ]
      },
      FIREBASE: {
        title: 'Firebase Authentication Error',
        steps: [
          'Check Firebase configuration',
          'Verify authentication state',
          'Ensure proper error handling in auth flows'
        ]
      },
      RENDER: {
        title: 'Rendering Error',
        steps: [
          'Check for null/undefined values in render',
          'Verify component props',
          'Ensure all required dependencies are imported'
        ]
      },
      NETWORK: {
        title: 'Network Error',
        steps: [
          'Check internet connectivity',
          'Verify API endpoints',
          'Ensure proper error handling in network calls'
        ]
      }
    };

    return solutions[errorType] || {
      title: 'Unknown Error',
      steps: [
        'Check recent code changes',
        'Review error stack trace',
        'Add error boundary if needed'
      ]
    };
  }

  async getPerformanceMetrics() {
    // Implement performance monitoring
    return {
      errorRate: this.calculateErrorRate(),
      responseTime: await this.measureResponseTime(),
      memoryUsage: await this.getMemoryUsage()
    };
  }

  calculateErrorRate() {
    const recentLogs = this.diagnosticLogs.filter(
      log => new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    return recentLogs.length;
  }

  async measureResponseTime() {
    // Implement response time measurement
    return {
      navigation: '120ms',
      apiCalls: '200ms',
      rendering: '50ms'
    };
  }

  async getMemoryUsage() {
    // Implement memory usage tracking
    return {
      used: '150MB',
      total: '512MB'
    };
  }

  async generateReport() {
    const metrics = await this.getPerformanceMetrics();
    return {
      timestamp: new Date().toISOString(),
      metrics,
      recentErrors: this.diagnosticLogs.slice(0, 10),
      recommendations: this.generateRecommendations(metrics)
    };
  }

  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.errorRate > 10) {
      recommendations.push({
        priority: 'HIGH',
        message: 'High error rate detected. Consider reviewing error patterns and implementing fixes.'
      });
    }

    // Add more recommendations based on metrics
    return recommendations;
  }
}

export default new AppDiagnosticsAgent(); 