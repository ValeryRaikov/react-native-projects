import { View, Image, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import { fetchBulgarianMovies, fetchBulgarianTVShows } from '@/services/api';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import MovieCard from '@/components/MovieCard';
import GoBack from '@/components/GoBack';
import { useTranslation } from 'react-i18next';
import useModal from '@/hooks/useModal';
import AlertModal from '@/components/AlertModal';
import TVSeriesCard from '@/components/TvShowCard';

const BulgarianMovies = () => {
  const {
    data: bgMovies,
    loading: bgMoviesLoading,
    error: bgMoviesError,
  } = useFetch(() => fetchBulgarianMovies());

  const {
    data: bgTvShows,
    loading: tvShowsLoading,
    error: bgTvShowsError,
  } = useFetch(() => fetchBulgarianTVShows());

  const {
    modalVisible,
    modalTitle,
    modalMessage,
    modalType,
    showModal,
    hideModal,
  } = useModal();

  useEffect(() => {
    if (bgMoviesError || bgTvShowsError) {
      showModal(t('Error'), t('Something went wrong while fetching bulgarian movies and TV shows.'), 'error');
    }
  }, [bgMoviesError, bgTvShowsError]);

  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-primary">
      <GoBack />

      <Image source={images.bg} className="absolute w-full z- 0" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
        }}
        className="flex-1 px-5"
      >
          <Image 
            source={icons.bg} 
            className="w-24 h-20 mt-20 mb-1 mx-auto" 
            resizeMode='contain' 
          />

          {bgMoviesLoading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
          ) : bgMoviesError ? (
            <Text>{t('Error')}: {bgMoviesError?.message}</Text>
          ) : (
            <View className="flex-1 mt-5">
              {bgMovies && (
                <>
                  <Text className="text-3xl text-center text-white font-bold mt-5 mb-3">{t('Welcome')}</Text>
                  <Text className='text-xl text-center text-gray-500 font-semibold mb-3'>
                    {t('This is a special page only for bulgarian movies. Enjoy and discover bulgarian cinematography')}...
                  </Text>
                  <Text className="text-lg text-white font-bold mb-3">{t('Bulgarian Movies')}</Text>

                  <FlatList
                    data={bgMovies}
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
              )}
            </View>
          )}

          <>
            {tvShowsLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
              ) : bgTvShowsError ? (
                <Text>{t('Error')}: {bgTvShowsError?.message}</Text>
              ) : (
                <View className="flex-1 mt-5">
                  <Text className="text-lg text-white font-bold mb-3">{t('Bulgarian TV Shows')}</Text>
                  <FlatList
                    data={bgTvShows}
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
  )
}

export default BulgarianMovies