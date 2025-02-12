import axios from 'axios';

const API_URL = 'https://your-backend-api.com';

export const getChildProgress = async (childId) => {
  try {
    const response = await axios.get(`${API_URL}/progress/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch progress');
  }
};

export const getTasksForChild = async (childId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${childId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};