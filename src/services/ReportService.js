import axios from 'axios';

const API_URL = 'https://your-backend-api.com';

export const generateReport = async (childId) => {
  try {
    const response = await axios.get(`${API_URL}/reports/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate report');
  }
};