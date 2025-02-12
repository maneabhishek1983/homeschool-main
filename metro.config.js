const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom configuration
config.resolver.assetExts.push('cjs');
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

// Optimize bundling
config.maxWorkers = 4;
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true
  }
};

module.exports = config; 