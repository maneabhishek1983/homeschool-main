import AgentManager from './AgentManager';

export async function initializeAI() {
  try {
    await AgentManager.initialize();
    
    // Set up global error tracking
    const originalErrorHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler(async (error, isFatal) => {
      try {
        const report = await AgentManager.agents.diagnostics.handleError(error, isFatal);
        console.log('AI Agent processed error:', report);
      } catch (e) {
        console.error('AI Agent failed to process error:', e);
      }
      originalErrorHandler(error, isFatal);
    });

    // Set up performance monitoring
    if (__DEV__) {
      setInterval(async () => {
        try {
          const report = await AgentManager.generateComprehensiveReport();
          console.log('AI Agents Report:', report);
        } catch (e) {
          console.error('Failed to generate AI agents report:', e);
        }
      }, 300000); // Generate report every 5 minutes in development
    }

    console.log('AI system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AI system:', error);
  }
}

export function trackScreenView(screenName) {
  AgentManager.agents.feature.trackScreenView(screenName);
}

export function trackFeatureUsage(featureName) {
  AgentManager.agents.feature.trackFeatureUsage(featureName);
}

export function trackUserAction(action) {
  AgentManager.agents.feature.trackUserAction(action);
}

export async function generateAIReport() {
  return AgentManager.generateComprehensiveReport();
} 