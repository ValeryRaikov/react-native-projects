import { View, Image, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import useFetch from '@/hooks/useFetch'
import { getSavedMovies } from '@/services/appwrite'
import SavedMovieCard from '@/components/SavedMovieCard'

const Saved = () => {
  const { 
    data: savedMovies, 
    loading, 
    error, 
  } = useFetch(() => getSavedMovies());

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z- 0" />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: '100%',
            paddingBottom: 10,
          }}
          className="flex-1 px-5"
        >
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
          ) : error ? (
            <Text>Error: {error?.message}</Text>
          ) : (
            <View className="flex-1 mt-5">
              <>
                  <Text className="text-lg text-white font-bold mt-5 mb-3">Your Saved Movies</Text>

                  {savedMovies?.length === 0 ? (
                    <Text className="text-center text-xl text-white mt-10">No saved movies yet!</Text>
                  ) : (
                    <FlatList
                      data={savedMovies}
                      renderItem={({ item }) => {
                        const mappedMovie = {
                          id: item.movie_id,
                          poster_path: item.poster_url,
                          title: item.title,
                        };

                        return <SavedMovieCard {...mappedMovie} />;
                      }}
                      keyExtractor={(item) => item.movie_id.toString()}
                      numColumns={3}
                      columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                      }}
                      className="mt-2 pb-32"
                      scrollEnabled={false}
                    />
                  )}
                </>
            </View>
          )}
        </ScrollView>
      </View>
  )
}

export default Saved