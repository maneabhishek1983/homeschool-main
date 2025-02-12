import { useWindowDimensions, Platform } from 'react-native';
import { StyleSheet, View } from 'react-native';

const Layout = ({ children }) => {
  const { width } = useWindowDimensions();
  
  const getLayoutType = () => {
    if (Platform.OS !== 'web') return 'mobile';
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  };

  return (
    <View style={styles[getLayoutType()]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    maxWidth: 1440,
    marginHorizontal: 'auto'
  },
  tablet: {
    flex: 1,
    paddingHorizontal: 24
  },
  mobile: {
    flex: 1,
    paddingHorizontal: 16
  }
});

export default Layout;
