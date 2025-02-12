import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PerformanceAgent {
  constructor() {
    this.metrics = {
      renderTimes: {},
      interactionTimes: {},
      memoryUsage: [],
      networkRequests: [],
    };
    this.thresholds = {
      renderTime: 16, // ms (targeting 60fps)
      interactionDelay: 100, // ms
      memoryUsage: 150, // MB
      networkTimeout: 5000, // ms
    };
  }

  async initialize() {
    try {
      // Load previous metrics
      const savedMetrics = await AsyncStorage.getItem('performanceMetrics');
      if (savedMetrics) {
        this.metrics = { ...this.metrics, ...JSON.parse(savedMetrics) };
      }

      // Start monitoring
      this.startMonitoring();
      
      console.log('PerformanceAgent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PerformanceAgent:', error);
    }
  }

  startMonitoring() {
    // Monitor render performance
    this.monitorRenderPerformance();
    
    // Monitor interactions
    this.monitorInteractions();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network requests
    this.monitorNetworkRequests();
  }

  monitorRenderPerformance() {
    // Use React Native Performance API when available
    if (__DEV__) {
      console.log('Performance monitoring enabled in development');
    }
  }

  monitorInteractions() {
    InteractionManager.addListener('interactionComplete', (event) => {
      const { name, duration } = event;
      this.metrics.interactionTimes[name] = duration;
      this.checkInteractionPerformance(name, duration);
    });
  }

  monitorMemoryUsage() {
    // Implement memory usage monitoring
    setInterval(async () => {
      const usage = await this.getMemoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        usage,
      });
      
      // Keep only last 100 measurements
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }
      
      this.checkMemoryUsage(usage);
    }, 60000); // Check every minute
  }

  monitorNetworkRequests() {
    // Monitor fetch calls
    const originalFetch = global.fetch;
    global.fetch = async (...args) => {
      const start = Date.now();
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - start;
        
        this.recordNetworkRequest({
          url: args[0],
          duration,
          status: response.status,
          success: true,
        });
        
        return response;
      } catch (error) {
        const duration = Date.now() - start;
        
        this.recordNetworkRequest({
          url: args[0],
          duration,
          error: error.message,
          success: false,
        });
        
        throw error;
      }
    };
  }

  recordNetworkRequest(request) {
    this.metrics.networkRequests.push({
      timestamp: Date.now(),
      ...request,
    });
    
    // Keep only last 100 requests
    if (this.metrics.networkRequests.length > 100) {
      this.metrics.networkRequests.shift();
    }
    
    this.checkNetworkPerformance(request);
  }

  checkInteractionPerformance(name, duration) {
    if (duration > this.thresholds.interactionDelay) {
      console.warn(`Slow interaction detected: ${name} took ${duration}ms`);
      this.generateOptimizationSuggestion('interaction', { name, duration });
    }
  }

  checkMemoryUsage(usage) {
    if (usage > this.thresholds.memoryUsage) {
      console.warn(`High memory usage detected: ${usage}MB`);
      this.generateOptimizationSuggestion('memory', { usage });
    }
  }

  checkNetworkPerformance(request) {
    if (request.duration > this.thresholds.networkTimeout) {
      console.warn(`Slow network request detected: ${request.url} took ${request.duration}ms`);
      this.generateOptimizationSuggestion('network', request);
    }
  }

  generateOptimizationSuggestion(type, data) {
    const suggestions = {
      interaction: {
        title: 'Slow Interaction Detected',
        suggestions: [
          'Use useMemo or useCallback for expensive computations',
          'Implement virtualization for long lists',
          'Defer non-critical updates',
        ],
      },
      memory: {
        title: 'High Memory Usage Detected',
        suggestions: [
          'Implement proper cleanup in useEffect',
          'Optimize image sizes and caching',
          'Reduce unnecessary re-renders',
        ],
      },
      network: {
        title: 'Network Performance Issue Detected',
        suggestions: [
          'Implement request caching',
          'Optimize payload size',
          'Add retry logic for failed requests',
        ],
      },
    };

    return suggestions[type] || {
      title: 'Performance Issue Detected',
      suggestions: [
        'Review recent code changes',
        'Profile the application',
        'Consider implementing performance monitoring',
      ],
    };
  }

  async getMemoryUsage() {
    // Implement actual memory usage measurement
    return 100; // Mock value in MB
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: {
        averageRenderTime: this.calculateAverageRenderTime(),
        averageInteractionTime: this.calculateAverageInteractionTime(),
        averageMemoryUsage: this.calculateAverageMemoryUsage(),
        networkStats: this.calculateNetworkStats(),
      },
      recommendations: this.generateRecommendations(),
    };

    await AsyncStorage.setItem('performanceMetrics', JSON.stringify(this.metrics));
    return report;
  }

  calculateAverageRenderTime() {
    const times = Object.values(this.metrics.renderTimes);
    return times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  calculateAverageInteractionTime() {
    const times = Object.values(this.metrics.interactionTimes);
    return times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  calculateAverageMemoryUsage() {
    return this.metrics.memoryUsage.length
      ? this.metrics.memoryUsage.reduce((a, b) => a + b.usage, 0) / this.metrics.memoryUsage.length
      : 0;
  }

  calculateNetworkStats() {
    const requests = this.metrics.networkRequests;
    return {
      totalRequests: requests.length,
      successRate: requests.filter(r => r.success).length / requests.length,
      averageDuration: requests.reduce((a, b) => a + b.duration, 0) / requests.length,
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Check render performance
    if (this.calculateAverageRenderTime() > this.thresholds.renderTime) {
      recommendations.push({
        priority: 'HIGH',
        area: 'Rendering',
        message: 'High average render time detected. Consider implementing performance optimizations.',
      });
    }

    // Check interaction performance
    if (this.calculateAverageInteractionTime() > this.thresholds.interactionDelay) {
      recommendations.push({
        priority: 'MEDIUM',
        area: 'Interaction',
        message: 'Slow interaction times detected. Consider optimizing event handlers and animations.',
      });
    }

    // Check memory usage
    if (this.calculateAverageMemoryUsage() > this.thresholds.memoryUsage) {
      recommendations.push({
        priority: 'HIGH',
        area: 'Memory',
        message: 'High memory usage detected. Review memory management and implement cleanup.',
      });
    }

    return recommendations;
  }
}

export default new PerformanceAgent(); 