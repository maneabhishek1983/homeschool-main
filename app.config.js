export default {
  expo: {
    name: 'homeschool-hub',
    slug: 'homeschool-hub',
    version: '1.0.0',
    scheme: 'homeschoolhub',
    orientation: 'portrait',
    plugins: [
      "expo-font"
    ],
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.homeschoolhub"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.homeschoolhub"
    }
  }
}; 