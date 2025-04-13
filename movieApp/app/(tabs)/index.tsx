import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import useFetch from "@/hooks/useFetch";
import { fetchMovies, fetchTVShows } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TVSeriesCard from "@/components/TvShowCard";
import { useEffect, useState } from "react";
import useModal from "@/hooks/useModal";
import AlertModal from "@/components/AlertModal";

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const { 
    data: movies, 
    loading: moviesLoading, 
    error: moviesError, 
  } = useFetch(() => fetchMovies({ query: '' }));

  const {
    data: tvShows,
    loading: tvShowsLoading,
    error: tvShowsError,
  } = useFetch(() => fetchTVShows({ query: '' }));

  const [showTVSeries, setShowTVSeries] = useState(false);

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
      if (trendingError || moviesError || tvShowsError) {
        showModal(t('Error'), t('Something went wrong. Try reloading the app!'), 'error');
      }
    }, [trendingError, moviesError, tvShowsError]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z- 0" />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: '100%',
            paddingBottom: 120,
          }}
          className="flex-1 px-5"
        >
          {user && 
            <TouchableOpacity
              className="absolute top-2 left-2 p-2 flex-row justify-center items-center gap-2 bg-light-100 rounded-full"
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text className='text-secondary font-semibold text-lg'>
                {user.name}
              </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity 
            onPress={() => router.push('/bg-movies')}
            className='absolute top-2 right-2 p-2 flex-row justify-center items-center gap-2 bg-black rounded-full'
          >
            <Image source={icons.bg} className="size-8" resizeMode="contain"/>
            <Text className="text-white text-lg font-semibold">{t('BG')}</Text>
          </TouchableOpacity>
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

          {moviesLoading || trendingLoading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
          ) : moviesError || trendingError ? (
              <Text>{t('Error')}: {moviesError?.message || trendingError?.message}</Text>
            ) : (
            <View className="flex-1 mt-5">
              <SearchBar onPress={() => router.push("/search")} placeholder={t('Search for a movie')} />
                {trendingMovies && (
                  <>
                    <View className="mt-10">
                      <Text className="text-lg text-white font-bold mb-3">{t('Trending Movies')}</Text>
                    </View>

                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      className="mb-4 mt-3"
                      data={trendingMovies}
                      renderItem={({ item, index }) => (
                        <TrendingCard movie={item} index={index} />
                      )}
                      keyExtractor={(item) => item.movie_id.toString()}
                    />
                  </>
                )}
                <>
                  <Text className="text-lg text-white font-bold mt-5 mb-3">{t('Latest Movies')}</Text>

                  <FlatList
                    data={movies}
                    renderItem={({ item }) => (
                      <MovieCard {...item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: 'flex-start',
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,
                    }}
                    className="mt-2 pb-10"
                    scrollEnabled={false}
                  />
                </>
            </View>
          )}

          <>
            <TouchableOpacity 
              onPress={() => setShowTVSeries(!showTVSeries)}
              className={`py-3 px-4 rounded-lg border-2 border-white ${
                showTVSeries ? 'bg-white' : 'bg-secondary-100'
              }`}
            >
              <Text className={`text-lg font-semibold text-center ${
                showTVSeries ? 'text-black' : 'text-white'
              }`}>
                {showTVSeries ? t('Hide TV Shows') : t('Show TV Shows')}
              </Text>
            </TouchableOpacity>
            
            {showTVSeries && (
              tvShowsLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
              ) : tvShowsError ? (
                <Text>{t('Error')}: {tvShowsError?.message}</Text>
              ) : (
                <View className="flex-1 mt-5">
                  <Text className="text-lg text-white font-bold mb-3">{t('Trending TV Shows')}</Text>
                  <FlatList
                    data={tvShows}
                    renderItem={({ item }) => (
                      <TVSeriesCard
                        id={item.id}
                        poster_path={item.poster_path}
                        name={item.name}
                        vote_average={item.vote_average}
                        first_air_date={item.first_air_date}
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: 'flex-start',
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,
                    }}
                    className="mt-2 pb-10"
                    scrollEnabled={false}
                  />
                </View>
              )
            )}
          </>
        </ScrollView>

        <AlertModal
          visible={modalVisible}
          onClose={hideModal}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
    </View>
  );
}