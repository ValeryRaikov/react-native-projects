import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { fetchTVShowDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import { useTranslation } from 'react-i18next';
import GoBack from '@/components/GoBack';
import MovieInfo from '@/components/MovieInfo';
import useFetch from '@/hooks/useFetch';
import AlertModal from '@/components/AlertModal';
import useModal from '@/hooks/useModal';

const TVSeriesDetails = () => {
    const { id } = useLocalSearchParams();

    const { 
        data: tvShow, 
        loading,
        error, 
    } = useFetch(() => fetchTVShowDetails(id as string));

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
        if (error)
            showModal(t('Error'), error.message || t('Something went wrong while loading TV show details.'), 'error');
    }, [error]);


    return (
        <View className='bg-primary flex-1'>
            <ScrollView contentContainerStyle={{
                paddingBottom: 80,
            }}>
                {loading || !tvShow ? (
                    <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                ) : (
                    <>
                        <Image
                            source={{
                            uri: tvShow.poster_path
                                ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                                : 'https://placehold.co/600x400/1a1a1a/ffffff.png',
                            }}
                            className="w-full h-[550px]"
                            resizeMode="stretch"
                        />
                        
                        <View className='flex-col items-start justify-center mt-5 px-5'>
                            <Text className="text-white font-bold text-xl">{tvShow.name}</Text>

                            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                                <Image 
                                    source={icons.star} 
                                    className="size-4" 
                                />
                                <Text className='text-white font-bold text-sm'>
                                    {Math.round(tvShow?.vote_average ?? 0)} /10
                                </Text>
                                <Text className='text-light-200 text-sm'>
                                    {tvShow?.vote_count} {t('votes')}
                                </Text>
                            </View>

                            <MovieInfo label={t('Overview')} value={tvShow?.overview} />

                            <View className="flex-row justify-center items-center gap-5 mt-4">
                                <MovieInfo label={t('Year')} value={tvShow?.first_air_date.split('-')[0]} />
                                <MovieInfo label={t('Episodes')} value={tvShow?.number_of_episodes} />
                                <MovieInfo label={t('Seasons')} value={tvShow?.number_of_seasons} />
                            </View>
                        </View>
                    </>
                )}
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

export default TVSeriesDetails