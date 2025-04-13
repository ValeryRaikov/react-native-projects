import { View, Image, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import { fetchBulgarianMovies } from '@/services/api';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import MovieCard from '@/components/MovieCard';
import GoBack from '@/components/GoBack';
import { useTranslation } from 'react-i18next';
import useModal from '@/hooks/useModal';
import AlertModal from '@/components/AlertModal';

const BulgarianMovies = () => {
  const {
    data: bgMovies,
    loading,
    error,
  } = useFetch(() => fetchBulgarianMovies());

  const {
    modalVisible,
    modalTitle,
    modalMessage,
    modalType,
    showModal,
    hideModal,
  } = useModal();

  useEffect(() => {
    if (error) {
      showModal(t('Error'), error.message || t('Something went wrong while fetching bulgarian movies.'), 'error');
    }
  }, [error]);

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

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
          ) : error ? (
            <Text>{t('Error')}: {error?.message}</Text>
          ) : (
            <View className="flex-1 mt-5">
              {bgMovies && (
                <>
                  <Text className="text-3xl text-center text-white font-bold mt-5 mb-3">{t('Welcome')}</Text>
                  <Text className='text-xl text-center text-gray-500 font-semibold mb-3'>
                    {t('This is a special page only for bulgarian movies. Enjoy and discover bulgarian cinematography')}...
                  </Text>

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
                    className="mt-2 pb-32"
                    scrollEnabled={false}
                  />
                </>
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
  )
}

export default BulgarianMovies