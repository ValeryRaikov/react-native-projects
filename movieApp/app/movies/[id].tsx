import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useLocalSearchParams } from 'expo-router'
import useFetch from '@/hooks/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import MovieInfo from '@/components/MovieInfo';
import { checkIfMovieSaved, saveMovie } from '@/services/appwrite';
import AlertModal from '@/components/AlertModal';
import GoBack from '@/components/GoBack';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import useModal from '@/hooks/useModal';

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { 
    data: movie, 
    loading,
    error, 
  } = useFetch(() => fetchMovieDetails(id as string));
  const [saved, setSaved] = useState(false);

  const {
    modalVisible,
    modalTitle,
    modalMessage,
    modalType,
    showModal,
    hideModal,
  } = useModal();

  const { t } = useTranslation();

  useEffect(() => {
    const checkSaved = async () => {
      if (!movie) 
        return;
      
      try {
        const isSaved = await checkIfMovieSaved(movie.id);
        setSaved(isSaved);
      } catch (err) {
        console.error(err);
      }
    };
  
    checkSaved();
  }, [movie]);

  useEffect(() => {
    if (error)
      showModal(t('Error'), error.message || t('Something went wrong while loading movie details.'), 'error');
  }, [error]);

  const handleSaveMovie = async () => {
    try {
      if (!movie) 
        return;

      if (saved) {
        showModal(t('Already Saved'), t('You have already saved this movie.'), 'warning');
        return;
      }

      setSaved(true);
      await saveMovie(movie);
      showModal(t('Success'), t('Movie saved to your saved list.'), 'success');
    } catch (err) {
      console.error(err);
      showModal(t('Error'), t('Could not save this movie!'), 'error');
    }
  };

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 80,
      }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : movie ? (
          <>
            <View>
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} 
                className='w-full h-[550px]' 
                resizeMode='stretch'
              />

              {user &&
                <TouchableOpacity
                  className='absolute top-5 right-5 bg-dark-100 p-2 rounded-full z-10 flex-row justify-center items-center gap-1'
                  onPress={handleSaveMovie}
                >
                  <Image 
                    source={icons.save} 
                    className='size-7' 
                    tintColor='#fff'
                  />
                  {saved 
                    ? <Text className='text-white font-semibold text-lg'>{t('SavedM')}</Text> 
                    : <Text className='text-white text-lg'>{t('Save')}</Text>
                  }
                </TouchableOpacity>
              }
              
            </View>
            <View className='flex-col items-start justify-center mt-5 px-5'>
              <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
              <View className='flex-row items-center gap-x-1 mt-2'>
                <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
                <Text className='text-light-200 text-sm'>{movie?.runtime} {t('minutes')}</Text>
              </View>
              <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
                <Image
                  source={icons.star}
                  className='size-4'
                />
                <Text className='text-white font-bold text-sm'>
                  {Math.round(movie?.vote_average ?? 0)} /10
                </Text>
                <Text className='text-light-200 text-sm'>
                  {movie?.vote_count} {t('votes')}
                </Text>
              </View>

              <MovieInfo label={t('Overview')} value={movie?.overview} />
              <MovieInfo label={t('Genres')} value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />
              
              <View className='flex flex-row justify-between w-1/2'>
                <MovieInfo label={t('Budget')} value={`$${movie?.budget / 1000000} ${t('million')} `} />
                <MovieInfo label={t('Revenue')} value={`$${Math.round(movie?.revenue) / 1000000} ${t('million')} `} />
              </View>

              <MovieInfo 
                label={t('Production Companies')}
                value={movie?.production_companies.map((c) => c.name).join(' - ') || 'N/A'} 
              />
            </View>
          </>
        ) : null}
        
      </ScrollView>

      <GoBack />

      <AlertModal 
        visible={modalVisible} 
        onClose={hideModal}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </View>
  )
}

export default MovieDetails