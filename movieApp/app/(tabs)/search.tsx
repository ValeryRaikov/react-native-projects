import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { fetchActors, fetchMovies, fetchTVShows } from '@/services/api'
import useFetch from '@/hooks/useFetch'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'
import { useTranslation } from 'react-i18next'
import { Link } from 'expo-router'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: moviesData, 
    loading: moviesLoading, 
    error: moviesError ,
    refetch: loadMovies,
    reset: resetMovies,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const {
    data: tvShowsData,
    loading: tvShowsLoading,
    error: tvShowsError,
    refetch: loadTVShows,
    reset: resetTVShows,
  } = useFetch(() => fetchTVShows({ query: searchQuery }), false);

  const {
    data: actorsData,
    loading: actorsLoading,
    error: actorsError,
    refetch: loadActors,
    reset: resetActors,
  } = useFetch(() => fetchActors({ query: searchQuery }), false);

  const movies = moviesData ?? [];
  const tvShows = tvShowsData ?? [];
  const actors = actorsData ?? [];

  const { t } = useTranslation();

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await Promise.all([
          loadMovies(),
          loadTVShows(),
          loadActors(),
        ]);
      } else {
        resetMovies();
        resetTVShows();
        resetActors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies && movies.length > 0 && movies[0])
      updateSearchCount(searchQuery, movies[0]);
  }, [movies]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex-row justify-center items-center mt-20">
            <Image source={icons.logo} className="w-12 h-10" />
          </View>

          <View className="my-5">
            <SearchBar
              placeholder={t('Search your movie, TV show or actor')}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {(moviesLoading || tvShowsLoading || actorsLoading) && (
            <ActivityIndicator size="large" color="#0000ff" className="my-5 self-center" />
          )}

          {(moviesError || tvShowsError || actorsError) && (
            <Text className="text-red-500 px-5 my-3">
              {t('Error')}: {moviesError?.message || tvShowsError?.message || actorsError?.message}
            </Text>
          )}

          {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
            <Text className='text-xl text-white font-bold'>
              {t('Search results for')} {' '}
              <Text className='text-accent'>{searchQuery}</Text>
            </Text>
          )}

          {searchQuery.trim() && (
            <>
              {movies && movies.length > 0 && (
                <>
                  <Text className="text-xl text-white font-bold my-4">{t('Movies')}</Text>
                  <FlatList
                    data={movies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Link href={`/movies/${item.id}`} asChild>
                        <TouchableOpacity className="w-32">
                          <Image
                            source={{
                              uri: item.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
                            }}
                            className="w-32 h-48 rounded-lg"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>
                            {item.title}
                          </Text>

                          <View className='flex-row items-center justify-start gap-x-1'>
                            {Array.from({ length: Math.round(item.vote_average / 2) }).map((_, index) => (
                              <Image key={index} source={icons.star} className='size-4' />
                            ))}
                            <Text className='text-ss text-white font-bold uppercase'>
                              {Math.round(item.vote_average / 2)}
                            </Text>
                          </View>
                
                          <View className='flex-row items-center justify-between'>
                            <Text className='text-xs text-light-300 font-medium mt-1'>
                              {item.release_date?.split('-')[0]}
                            </Text>
                            <Text className='text-ss font-medium text-light-300'>
                              {t('Movie')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Link>
                    )}
                  />
                </>
              )}
              <View className="h-[1px] bg-white my-6" />

              {tvShows && tvShows.length > 0 && (
                <>
                  <Text className="text-xl text-white font-bold my-4">{t('TV Shows')}</Text>
                  <FlatList
                    data={tvShows}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Link href={`/tv/${item.id}`} asChild>
                        <TouchableOpacity className="w-32">
                          <Image
                            source={{
                              uri: item.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
                            }}
                            className="w-32 h-48 rounded-lg"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>
                            {item.name}
                          </Text>

                          <View className="flex-row items-center justify-start gap-x-1">
                            {Array.from({ length: Math.round(item.vote_average / 2) }).map((_, index) => (
                              <Image key={index} source={icons.star} className="size-4" />
                            ))}
                            <Text className="text-ss text-white font-bold uppercase">
                              {Math.round(item.vote_average / 2)}
                            </Text>
                          </View>
                  
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs text-light-300 font-medium mt-1">
                              {item.first_air_date?.split('-')[0]}
                            </Text>
                            <Text className="text-ss font-medium text-light-300">
                              {t('TV Show')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Link>
                    )}
                  />
                </>
              )}
              <View className="h-[1px] bg-white my-6" />

              {actors && actors.length > 0 && (
                <>
                  <Text className="text-xl text-white font-bold my-4">{t('Actors')}</Text>
                  <FlatList
                    data={actors}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Link href={`/actors/${item.id}`} asChild>
                        <TouchableOpacity className="w-32">
                          <Image
                            source={{
                              uri: item.profile_path
                                ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                                : 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
                            }}
                            className="w-32 h-48 rounded-lg"
                            resizeMode="cover"
                          />
                          <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>
                            {item.name}
                          </Text>

                          <View className='flex-row items-center justify-start gap-x-1'>
                            <Text className='text-ss text-light-300'>
                              {t('Popularity')}: {Math.round(item.popularity)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Link>
                    )}
                  />
                </>
              )}
              <View className="h-[1px] bg-white my-6" />

              {movies.length === 0 && tvShows.length === 0 && actors.length === 0 && (
                <View className="mt-10 px-5">
                  <Text className="text-center text-gray-500">
                    {t('No results found for')} "{searchQuery}"
                  </Text>
                </View>
              )}
            </>
          )}

          {!searchQuery.trim() && (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {t('Search for a movie, TV show or actor')}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  )
}

export default Search