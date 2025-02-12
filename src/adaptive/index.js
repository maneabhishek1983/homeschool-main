// src/adaptive/index.js
import { Platform } from 'react-native';
import WebApp from '../web/App';
import MobileApp from '../mobile/App';

export default Platform.select({
  web: WebApp,
  default: MobileApp
});