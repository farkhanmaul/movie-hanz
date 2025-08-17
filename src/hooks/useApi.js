import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunc, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData(...dependencies);
    }
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};