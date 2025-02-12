import { Text } from 'react-native';
import Layout from './Layout';

export default {
  title: 'Responsive/Layout',
  component: Layout,
};

export const Mobile = () => (
  <Layout>
    <Text>Mobile Layout</Text>
  </Layout>
);

export const Tablet = () => (
  <Layout>
    <Text>Tablet Layout</Text>
  </Layout>
);
