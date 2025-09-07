import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface UseStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useSecureStorage = <T>(key: string): UseStorageReturn<T> => {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedValue = await SecureStore.getItemAsync(key);
      if (storedValue) {
        setValue(JSON.parse(storedValue));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const storeValue = async (newValue: T) => {
    try {
      setError(null);
      await SecureStore.setItemAsync(key, JSON.stringify(newValue));
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const removeValue = async () => {
    try {
      setError(null);
      await SecureStore.deleteItemAsync(key);
      setValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    value,
    setValue: storeValue,
    removeValue,
    loading,
    error,
  };
};
