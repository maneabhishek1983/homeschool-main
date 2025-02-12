import AppDiagnosticsAgent from './agents/AppDiagnosticsAgent';
import PerformanceAgent from './agents/PerformanceAgent';
import FeatureAgent from './agents/FeatureAgent';

class AgentManager {
  constructor() {
    this.agents = {
      diagnostics: AppDiagnosticsAgent,
      performance: PerformanceAgent,
      feature: FeatureAgent,
    };
  }

  async initialize() {
    try {
      // Initialize all agents
      await Promise.all([
        this.agents.diagnostics.initialize(),
        this.agents.performance.initialize(),
        this.agents.feature.initialize(),
      ]);

      console.log('All agents initialized successfully');
    } catch (error) {
      console.error('Failed to initialize agents:', error);
    }
  }

  async generateComprehensiveReport() {
    try {
      const [diagnosticsReport, performanceReport, featureReport] = await Promise.all([
        this.agents.diagnostics.generateReport(),
        this.agents.performance.generateReport(),
        this.agents.feature.generateReport(),
      ]);

      return {
        timestamp: new Date().toISOString(),
        diagnostics: diagnosticsReport,
        performance: performanceReport,
        features: featureReport,
        summary: this.generateSummary({
          diagnosticsReport,
          performanceReport,
          featureReport,
        }),
        recommendations: this.prioritizeRecommendations({
          diagnosticsReport,
          performanceReport,
          featureReport,
        }),
      };
    } catch (error) {
      console.error('Failed to generate comprehensive report:', error);
      throw error;
    }
  }

  generateSummary({ diagnosticsReport, performanceReport, featureReport }) {
    const summary = {
      health: this.calculateHealthScore({
        diagnosticsReport,
        performanceReport,
        featureReport,
      }),
      criticalIssues: this.identifyCriticalIssues({
        diagnosticsReport,
        performanceReport,
        featureReport,
      }),
      improvements: this.identifyImprovements({
        diagnosticsReport,
        performanceReport,
        featureReport,
      }),
    };

    return summary;
  }

  calculateHealthScore({ diagnosticsReport, performanceReport, featureReport }) {
    let score = 100;

    // Reduce score based on critical issues
    const criticalIssues = diagnosticsReport.recentErrors.filter(
      error => error.isFatal
    ).length;
    score -= criticalIssues * 10;

    // Reduce score based on performance issues
    if (performanceReport.metrics.averageRenderTime > 16) {
      score -= 5;
    }
    if (performanceReport.metrics.averageInteractionTime > 100) {
      score -= 5;
    }

    // Reduce score based on feature usage
    const avgSessionDuration = featureReport.analysis.averageSessionDuration;
    if (avgSessionDuration < 300000) { // Less than 5 minutes
      score -= 5;
    }

    return Math.max(0, score); // Ensure score doesn't go below 0
  }

  identifyCriticalIssues({ diagnosticsReport, performanceReport, featureReport }) {
    const criticalIssues = [];

    // Add diagnostic critical issues
    diagnosticsReport.recentErrors
      .filter(error => error.isFatal)
      .forEach(error => {
        criticalIssues.push({
          type: 'ERROR',
          source: 'Diagnostics',
          message: error.message,
          priority: 'HIGH',
        });
      });

    // Add performance critical issues
    if (performanceReport.metrics.averageRenderTime > 32) { // 2 frames
      criticalIssues.push({
        type: 'PERFORMANCE',
        source: 'Performance',
        message: 'Severe rendering performance issues detected',
        priority: 'HIGH',
      });
    }

    // Add feature critical issues
    if (featureReport.analysis.averageSessionDuration < 120000) { // Less than 2 minutes
      criticalIssues.push({
        type: 'ENGAGEMENT',
        source: 'Feature',
        message: 'Very low user engagement detected',
        priority: 'HIGH',
      });
    }

    return criticalIssues;
  }

  identifyImprovements({ diagnosticsReport, performanceReport, featureReport }) {
    const improvements = [];

    // Add diagnostic improvements
    diagnosticsReport.recommendations.forEach(rec => {
      if (rec.priority !== 'HIGH') {
        improvements.push({
          type: 'DIAGNOSTIC',
          source: 'Diagnostics',
          message: rec.message,
          priority: rec.priority,
        });
      }
    });

    // Add performance improvements
    performanceReport.recommendations.forEach(rec => {
      if (rec.priority !== 'HIGH') {
        improvements.push({
          type: 'PERFORMANCE',
          source: 'Performance',
          message: rec.message,
          priority: rec.priority,
        });
      }
    });

    // Add feature improvements
    featureReport.recommendations.forEach(rec => {
      if (rec.priority !== 'HIGH') {
        improvements.push({
          type: 'FEATURE',
          source: 'Feature',
          message: rec.suggestion,
          priority: rec.priority,
        });
      }
    });

    return improvements;
  }

  prioritizeRecommendations({ diagnosticsReport, performanceReport, featureReport }) {
    const allRecommendations = [
      ...diagnosticsReport.recommendations.map(rec => ({
        ...rec,
        source: 'Diagnostics',
      })),
      ...performanceReport.recommendations.map(rec => ({
        ...rec,
        source: 'Performance',
      })),
      ...featureReport.recommendations.map(rec => ({
        ...rec,
        source: 'Feature',
      })),
    ];

    // Sort by priority (HIGH > MEDIUM > LOW)
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return allRecommendations.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

export default new AgentManager(); 