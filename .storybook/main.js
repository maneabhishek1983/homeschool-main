// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true }
  }
};