import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/hooks/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import MovieInfo from '@/components/MovieInfo';
import { checkIfMovieSaved, saveMovie } from '@/services/appwrite';
import AlertModal from '@/components/AlertModal';

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { 
    data: movie, 
    loading,
    error, 
  } = useFetch(() => fetchMovieDetails(id as string));
  const [saved, setSaved] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');

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
      showModal('Error', error.message || 'Something went wrong while loading movie details.', 'error');
  }, [error]);

  const showModal = (title: string, message: string, type = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleSaveMovie = async () => {
    try {
      if (!movie) 
        return;

      if (saved) {
        showModal('Already Saved', 'You have already saved this movie.', 'warning');
        return;
      }

      setSaved(true);
      await saveMovie(movie);
      showModal('Success', 'Movie saved to your saved list.', 'success');
    } catch (err) {
      console.error(err);
      showModal('Error', 'Could not save this movie!', 'error');
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
                  ? <Text className='text-white font-semibold text-lg'>Saved</Text> 
                  : <Text className='text-white text-lg'>Save</Text>
                }
              </TouchableOpacity>
            </View>
            <View className='flex-col items-start justify-center mt-5 px-5'>
              <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
              <View className='flex-row items-center gap-x-1 mt-2'>
                <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
                <Text className='text-light-200 text-sm'>{movie?.runtime} minutes</Text>
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
                  {movie?.vote_count} votes
                </Text>
              </View>

              <MovieInfo label='Overview' value={movie?.overview} />
              <MovieInfo label='Genres' value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />
              
              <View className='flex flex-row justify-between w-1/2'>
                <MovieInfo label='Budget' value={`$${movie?.budget / 1000000} million`} />
                <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue) / 1000000} million`} />
              </View>

              <MovieInfo 
                label='Production Companies' 
                value={movie?.production_companies.map((c) => c.name).join(' - ') || 'N/A'} 
              />
            </View>
          </>
        ) : null}
        
      </ScrollView>

      <TouchableOpacity 
        className='absolute bottom-5 left-0 rigth-0 mx-5 bg-accent rounded-lg py-3.5 felx-row items-center justify-center z-50'
        onPress={router.back}
        >
        <Image 
          source={icons.arrow}
          className='size-5 mr-1 mt-0.5 rotate-180'
          tintColor='#fff'
        />
        <Text className='text-white font-semibold text-base'>Go back</Text>
      </TouchableOpacity>

      {modalVisible && 
        <AlertModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
      }
    </View>
  )
}

export default MovieDetails