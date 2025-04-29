import React, { createContext, useCallback, useContext } from 'react';
import useFetch from '@/hooks/useFetch';
import { getSavedMovies } from '@/services/appwrite';
import { useAuth } from './AuthContext';

const SavedMoviesContext = createContext<any>(null);

export const SavedMoviesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const fetchSavedMovies = useCallback(async () => {
    if (!user?.$id) 
      return [];

    try {
      return await getSavedMovies(user.$id);
    } catch (err) {
      console.error("Failed to fetch saved movies:", err);
      return [];
    }
  }, [user?.$id]);

  const {
    data: savedMovies = [],
    loading,
    error,
    refetch: refreshSavedMovies,
  } = useFetch(fetchSavedMovies);

  const value = { 
    savedMovies: user?.$id ? savedMovies : [],
    loading, 
    error, 
    refreshSavedMovies, 
  };

  return (
    <SavedMoviesContext.Provider value={value}>
      {children}
    </SavedMoviesContext.Provider>
  )
}

export const useSavedMovies = () => useContext(SavedMoviesContext);
