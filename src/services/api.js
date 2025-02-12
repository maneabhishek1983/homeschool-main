// src/services/api.js
import { Platform } from 'react-native';

const API_BASE = Platform.select({
  web: process.env.NEXT_PUBLIC_API_URL,
  default: process.env.EXPO_PUBLIC_API_URL
});

export const fetchData = async (endpoint) => {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  return Platform.OS === 'web' 
    ? response.json()
    : response.json().then(nativeFormatting);
};