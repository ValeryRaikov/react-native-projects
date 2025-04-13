import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { useTranslation } from 'react-i18next';

type TVSeriesCardProps = {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date?: string;
};

const TVSeriesCard = ({ id, name, poster_path, vote_average, first_air_date }: TVSeriesCardProps) => {
  const { t } = useTranslation();

  return (
    <Link href={`/tv/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://placehold.co/600x400/1a1a1a/ffffff.png',
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>{name}</Text>

        <View className="flex-row items-center justify-start gap-x-1">
          {Array.from({ length: Math.round(vote_average / 2) }).map((_, index) => (
            <Image key={index} source={icons.star} className="size-4" />
          ))}
          <Text className="text-ss text-white font-bold uppercase">{Math.round(vote_average / 2)}</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {first_air_date?.split('-')[0]}
          </Text>
          <Text className="text-ss font-medium text-light-300">
            {t('TV Show')}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default TVSeriesCard