import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    popularity: number;
}

const ActorCard = ({ id, profile_path, name, popularity }: Actor) => {
  const { t } = useTranslation();

  return (
    // @ts-ignore
    <Link href={`/actors/${id}`} asChild>
      <TouchableOpacity className='w-[30%]'>
        <Image 
          source={{
            uri: profile_path 
              ? `https://image.tmdb.org/t/p/w500${profile_path}`
              : 'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image',
          }}
          className='w-full h-52 rounded-lg'
          resizeMode='cover'
        />

        <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>
          {name}
        </Text>

        <View className='flex-row items-center justify-start gap-x-1'>
          <Text className='text-ss text-light-300'>
            {t('Popularity')}: {Math.round(popularity)}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default ActorCard