// src/services/prodigy-api.js
import { AuthSession } from 'expo-auth-session';
import { Platform } from 'react-native';
import { SecureStore } from 'expo-secure-store';

const discovery = {
  authorizationEndpoint: 'https://accounts.prodigygame.com/oauth2/auth',
  tokenEndpoint: 'https://api.prodigygame.com/oauth2/token',
};

const config = {
  clientId: process.env.PRODIGY_CLIENT_ID,
  clientSecret: process.env.PRODIGY_CLIENT_SECRET,
  redirectUri: AuthSession.makeRedirectUri({
    native: 'com.homeschoolhub://oauth',
    useProxy: Platform.OS === 'web'
  }),
};

// Token management
const storeTokens = async (tokens) => {
  await SecureStore.setItemAsync('prodigyTokens', JSON.stringify({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: Date.now() + (tokens.expiresIn * 1000)
  }));
};

export const prodigyAuth = {
  login: async () => {
    const request = new AuthSession.AuthRequest(config);
    const result = await request.promptAsync(discovery);
    
    if (result.type === 'success') {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        { code: result.params.code, ...config },
        discovery
      );
      await storeTokens(tokenResult);
      return true;
    }
    return false;
  },

  refresh: async () => {
    const tokens = JSON.parse(await SecureStore.getItemAsync('prodigyTokens'));
    
    if (Date.now() > tokens.expiresIn) {
      const result = await AuthSession.refreshAsync(
        { refreshToken: tokens.refreshToken, ...config },
        discovery
      );
      await storeTokens(result);
      return result.accessToken;
    }
    return tokens.accessToken;
  }
};

// API Client
const apiRequest = async (method, endpoint, data) => {
  const accessToken = await prodigyAuth.refresh();
  
  const response = await fetch(`https://api.prodigygame.com/v1/${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

export const prodigyService = {
  getCurriculum: (grade) => apiRequest('GET', `curriculum/math/${grade}`),
  
  submitProgress: (studentId, data) => 
    apiRequest('POST', `students/${studentId}/progress`, data),
  
  getRecommendations: (studentId) => 
    apiRequest('GET', `recommendations/${studentId}`)
};