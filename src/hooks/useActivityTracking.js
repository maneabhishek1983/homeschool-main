import { useState, useEffect } from 'react';
import { getChildProgress } from '../services/ActivityService';

export const useActivityTracking = (childId) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const data = await getChildProgress(childId);
      setProgress(data);
      setLoading(false);
    };
    fetchProgress();
  }, [childId]);

  return { progress, loading };
};