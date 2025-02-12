// src/services/education-api.js
const API_BASE = Platform.select({
  web: process.env.NEXT_PUBLIC_EDUCATION_API,
  default: process.env.EXPO_PUBLIC_EDUCATION_API 
});

// Khan Academy endpoint example
export const fetchMathCurriculum = async (grade) => 
  apiRequest({
    method: 'GET',
    url: `/api/v1/topic/math/grade-${grade}`
  });