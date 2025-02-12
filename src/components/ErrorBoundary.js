const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');
const diagnostics = require('../services/diagnostics/AppDiagnostics');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      solution: null
    };

    // Add global error handler
    if (global.ErrorUtils) {
      global.ErrorUtils.setGlobalHandler(this.handleError.bind(this));
    }
  }

  handleError = async (error) => {
    console.log('🚨 Error caught:', error);
    try {
      const solution = await diagnostics.getErrorSolution(error.toString());
      console.log('💡 Solution found:', solution);
      this.setState({ 
        hasError: true, 
        error, 
        solution 
      });
    } catch (diagError) {
      console.error('Diagnostic error:', diagError);
    }
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('⚠️ ComponentDidCatch:', error);
    this.handleError(error);
  }

  handleRetry = () => {
    const { solution } = this.state;
    if (solution && solution.commands) {
      console.log('🔄 Executing commands:', solution.commands);
    }
    this.setState({ hasError: false, error: null, solution: null });
  };

  renderSolution() {
    const { solution } = this.state;
    if (!solution) return null;

    return (
      <View style={styles.solutionContainer}>
        <Text style={styles.solutionTitle}>Suggested Fix:</Text>
        <Text style={styles.description}>{solution.description}</Text>
        
        <Text style={styles.sectionTitle}>Commands to Run:</Text>
        {solution.commands && solution.commands.map((command, index) => (
          <View key={index} style={styles.commandContainer}>
            <Text style={styles.command}>{command}</Text>
          </View>
        ))}

        {solution.codeChanges && solution.codeChanges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Code Changes Needed:</Text>
            {solution.codeChanges.map((change, index) => (
              <View key={index} style={styles.codeChangeContainer}>
                <Text style={styles.codeChangeTitle}>{change.file}</Text>
                <Text style={styles.codeChangeDescription}>{change.description}</Text>
              </View>
            ))}
          </>
        )}

        {solution.recommendations && (
          <>
            <Text style={styles.sectionTitle}>Recommendations:</Text>
            {solution.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendation}>• {rec}</Text>
            ))}
          </>
        )}
      </View>
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.error}>{this.state.error?.toString()}</Text>
          
          {this.renderSolution()}

          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF3B30',
  },
  error: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  solutionContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 20,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  commandContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  command: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  codeChangeContainer: {
    backgroundColor: '#e8e8e8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  codeChangeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  codeChangeDescription: {
    fontSize: 12,
    color: '#666',
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

module.exports = ErrorBoundary; 