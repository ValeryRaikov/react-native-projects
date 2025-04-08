import { View, Image, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import useFetch from '@/hooks/useFetch'
import { getSavedMovies, unsaveMovie } from '@/services/appwrite'
import SavedMovieCard from '@/components/SavedMovieCard'
import AlertModal from '@/components/AlertModal'

const Saved = () => {
  const { 
    data: initialSavedMovies, 
    loading, 
    error, 
  } = useFetch(() => getSavedMovies());

  const [savedMovies, setSavedMovies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');

  useEffect(() => {
    if (initialSavedMovies) {
      setSavedMovies(initialSavedMovies);
    }
  }, [initialSavedMovies]);

  useEffect(() => {
    if (error) 
      showModal('Error', error.message || 'Something went wrong while fetching saved movies.', 'error');
  }, [error]);

  const showModal = (title: string, message: string, type = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleDelete = async (docId: string) => {
    try {
      await unsaveMovie(docId);
      setSavedMovies(prev => prev.filter(movie => movie.$id !== docId));
      showModal('Deleted', 'Movie removed from your saved list.', 'success');
    } catch (err) {
      console.error(err);
      showModal('Error', 'Failed to remove movie from saved list.', 'error');
    }
  };

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
          ) : initialSavedMovies ? (
            <View className="flex-1 mt-5">
              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Your Saved Movies</Text>

                {initialSavedMovies?.length === 0 ? (
                  <Text className="text-center text-xl text-white mt-10">No saved movies yet!</Text>
                ) : (
                  <FlatList
                    data={initialSavedMovies}
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
              </>
            </View>
          ) : null}
        </ScrollView>

        {modalVisible && (
          <AlertModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title={modalTitle}
            message={modalMessage}
            type={modalType}
          />
      )}
      </View>
  )
}

export default Saved