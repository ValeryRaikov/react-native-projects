import { ActivityIndicator, Image, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import MovieCard from '@/components/MovieCard'
import { fetchMovies } from '@/services/api'
import useFetch from '@/hooks/useFetch'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'
import { useTranslation } from 'react-i18next'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: movies = [], 
    loading: moviesLoading, 
    error: moviesError ,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const { t } = useTranslation();

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim())
        await loadMovies();
      else
        reset();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0])
      updateSearchCount(searchQuery, movies[0]);
  }, [movies]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  }

  return (
    <GestureHandlerRootView className='flex-1'>
      <View className='flex-1 bg-primary'>
        <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

        <FlatList 
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          className='px-5'
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'center',
            gap: 16,
            marginVertical: 16,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              <View className='w-full flex-row justify-center items-center mt-20'>
                <Image source={icons.logo} className='w-12 h-10' />
              </View>
              <View className='my-5'>
                <SearchBar 
                  placeholder={t('Search your movie')}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>

              {moviesLoading && (
                <ActivityIndicator size="large" color="#0000ff" className='my-3' />
              )}

              {moviesError && (
                <Text className='text-red-500 px-5 my-3'>{t('Error')}: {moviesError.message}</Text>
              )}

              {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
                <Text className='text-xl text-white font-bold'>
                  {t('Search results for')} {' '}
                  <Text className='text-accent'>{searchQuery}</Text>
                </Text>
              )}
            </>
          }
          ListEmptyComponent={
            !moviesLoading && !moviesError ? (
              <View className='mt-10 px-5'>
                <Text className='text-center text-gray-500'>
                  {searchQuery.trim() ? t('No movies found!') : t('Search for a movie')}
                </Text>
              </View>
            ) : null
          }
        />

      </View>
    </GestureHandlerRootView>
  )
}

export default Search