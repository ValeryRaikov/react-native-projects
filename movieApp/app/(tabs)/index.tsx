import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
                    className="mt-2 pb-32"
                    scrollEnabled={false}
                  />
                </>
            </View>
          )}
        </ScrollView>
    </View>
  );
}
