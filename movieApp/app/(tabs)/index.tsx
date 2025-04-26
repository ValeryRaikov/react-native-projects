import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import useFetch from "@/hooks/useFetch";
import { fetchActors, fetchMovies, fetchTVShows } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import TVSeriesCard from "@/components/TvShowCard";
import { useEffect, useState } from "react";
import useModal from "@/hooks/useModal";
import AlertModal from "@/components/AlertModal";
import ActorCard from "@/components/ActorCard";

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

  const {
    data: actors,
    loading: actorsLoading,
    error: actorsError,
  } = useFetch(() => fetchActors({ query: '' }));

  const [selectedCategory, setSelectedCategory] = useState<"media" | "people">("media");
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
      if (trendingError || moviesError || tvShowsError || actorsError) {
        showModal(t('Error'), t('Something went wrong. Try reloading the app!'), 'error');
      }
    }, [trendingError, moviesError, tvShowsError, actorsError]);

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

              <Text className="text-light-100 text-md text-center pt-8">
                {t('Select what you want to see...')}
              </Text>
              <View className="flex-row justify-center items-center gap-3 mt-2">
                <TouchableOpacity 
                  onPress={() => setSelectedCategory('media')} 
                  className={`py-3 px-4 rounded-lg border-2 border-white ${
                    selectedCategory === 'media' ? 'bg-white' : 'bg-secondary-100'
                  }`}
                >
                  <Text className={`text-lg font-semibold text-center ${
                    selectedCategory === 'media' ? 'text-black' : 'text-white'
                  }`}>
                    {t('Show Media')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setSelectedCategory('people')} 
                  className={`py-3 px-4 rounded-lg border-2 border-white ${
                    selectedCategory === 'people' ? 'bg-white' : 'bg-secondary-100'
                  }`}
                >
                  <Text className={`text-lg font-semibold text-center ${
                    selectedCategory === 'people' ? 'text-black' : 'text-white'
                  }`}>
                    {t('Show Actors')}
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedCategory === 'media' ? (
                <>
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

                  <Text className="text-lg text-white font-bold mt-5 mb-3">{t('Latest Movies')}</Text>
                  <FlatList
                    data={movies}
                    renderItem={({ item }) => <MovieCard {...item} />}
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

                  <TouchableOpacity 
                    onPress={() => setShowTVSeries(!showTVSeries)}
                    className={`py-3 px-4 rounded-lg border-2 border-white mt-5 ${showTVSeries ? 'bg-white' : 'bg-secondary-100'}`}
                  >
                    <Text className={`text-lg font-semibold text-center ${showTVSeries ? 'text-black' : 'text-white'}`}>
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
              ) : (
                <View className="flex-1 mt-10">
                  {actorsLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                  ) : actorsError ? (
                    <Text>{t('Error')}: {actorsError?.message}</Text>
                  ) : (
                    <>
                      <Text className="text-lg text-white font-bold mb-3">{t('Popular Actors')}</Text>
                      <FlatList
                        data={actors}
                        renderItem={({ item }) => <ActorCard {...item} />}
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
                  )}
                </View>
              )}
            </View>
          )}
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