import React, { createContext, useContext } from 'react';
import useFetch from '@/hooks/useFetch';
import { getSavedMovies } from '@/services/appwrite';

const SavedMoviesContext = createContext<any>(null);

export const SavedMoviesProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: savedMovies = [],
    loading,
    error,
    refetch: refreshSavedMovies,
  } = useFetch(getSavedMovies);

  return (
    <SavedMoviesContext.Provider value={{ savedMovies, loading, error, refreshSavedMovies }}>
      {children}
    </SavedMoviesContext.Provider>
  )
}

export const useSavedMovies = () => useContext(SavedMoviesContext);
