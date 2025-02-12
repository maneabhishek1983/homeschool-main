module.exports = {
  webpack: {
    configure: {
      resolve: {
        alias: {
          'react-native$': 'react-native-web'
        }
      }
    }
  }
}
