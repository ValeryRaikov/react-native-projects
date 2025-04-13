import { View, Image, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { unsaveMovie } from '@/services/appwrite';
import SavedMovieCard from '@/components/SavedMovieCard';
import AlertModal from '@/components/AlertModal';
import { useSavedMovies } from '@/context/SavedMoviesContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import useModal from '@/hooks/useModal';

const Saved = () => {
  const { user } = useAuth();
  const { savedMovies, loading, error, refreshSavedMovies } = useSavedMovies();
  const [refreshing, setRefreshing] = useState(false);

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
    if (error) {
      showModal(t('Error'), error.message || t('Something went wrong while fetching saved movies.'), 'error');
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await refreshSavedMovies();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }

  const handleDelete = async (docId: string) => {
    try {
      await unsaveMovie(docId);
      await handleRefresh();
      showModal(t('Deleted'), t('Movie removed from your saved list.'), 'success');
    } catch (err) {
      console.error(err);
      showModal(t('Error'), t('Failed to remove movie from saved list.'), 'error');
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
        }}
        className="flex-1 px-5"
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {!user ? (
          <Text className='text-light-100 text-xl text-center mt-10'>
            {t('You have to be logged in to save movies!')}
          </Text>
          ) : loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
          ) : (
            <View className="flex-1 mt-5">
              <Text className="text-lg text-white font-bold mt-5 mb-3">{t('Your Saved Movies')}</Text>
  
              {savedMovies?.length === 0 ? (
                <Text className="text-center text-xl text-white mt-10">{t('No saved movies yet!')}</Text>
              ) : (
                <FlatList
                  data={savedMovies}
                  renderItem={({ item }) => {
                    const mappedMovie = {
                      id: item.movie_id,
                      docId: item.$id,
                      poster_path: item.poster_url,
                      title: item.title,
                    };
  
                    return <SavedMovieCard {...mappedMovie} onDelete={() => handleDelete(item.$id)} />;
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
            </View>
          )}
      </ScrollView>

      {modalVisible && (
        <AlertModal
          visible={modalVisible}
          onClose={hideModal}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />
      )}
    </View>
  )
}

export default Saved