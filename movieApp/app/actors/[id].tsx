import { View, Text, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useFetch from '@/hooks/useFetch'
import { fetchActorDetails, fetchActorMovies } from '@/services/api'
import GoBack from '@/components/GoBack'
import MovieCard from '@/components/MovieCard'
import { useTranslation } from 'react-i18next'
import AlertModal from '@/components/AlertModal'
import useModal from '@/hooks/useModal'

const ActorDetails = () => {
  const { id } = useLocalSearchParams();

  const { 
    data: actor, 
    loading: actorLoading, 
    error: actorError 
  } = useFetch(() => fetchActorDetails(id as string));

  const { 
    data: actorMovies, 
    loading: moviesLoading, 
    error: moviesError 
  } = useFetch(() => fetchActorMovies(id as string));

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
    if (actorError || moviesError) {
      showModal(t('Error'), t('Something went wrong while loading actor details.'), 'error');
    }
  }, [actorError, moviesError]);

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ 
        paddingBottom: 80, 
      }}>
        {actorLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : actor ? (
          <>
            <Image
              source={{ uri: actor.profile_path 
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` 
                : 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image'
              }}
              className="w-full h-[500px] mt-8"
              resizeMode="contain"
            />

            <View className="px-5 mt-5">
              <Text className="text-white font-bold text-2xl">{actor.name}</Text>
              {actor.birthday && (
                <Text className="text-light-200 text-lg mt-2">
                  {t('Birthday')}: {`${actor.birthday.split("-")[2]}/${actor.birthday.split("-")[1]}/${actor.birthday.split("-")[0]}`}
                </Text>
              )}
              {actor.popularity && (
                <Text className="text-light-200 text-lg mt-1">{t('Popularity')}: {Math.round(actor.popularity)}</Text>
              )}
              {actor.biography && (
                <View className="mt-5">
                  <Text className="text-white font-bold text-lg mb-2">{t('Biography')}</Text>
                  <Text className="text-light-200 text-md">{actor.biography}</Text>
                </View>
              )}
            </View>

            <View className="mt-8 px-5">
              <Text className="text-white font-bold text-lg mb-2">{t('Movies with')} {actor.name}</Text>
              {moviesLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="mt-5 self-center" />
              ) : (
                <FlatList
                  data={actorMovies}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <MovieCard
                      id={item.id}
                      title={item.title}
                      poster_path={item.poster_path}
                      vote_average={item.vote_average}
                      release_date={item.release_date}
                    />
                  )}
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
              )}
            </View>
          </>
        ) : null}
      </ScrollView>

      <GoBack />

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

export default ActorDetails