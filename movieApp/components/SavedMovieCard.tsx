import { Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

type Props = {
    id: string | number
    docId?: string
    poster_path: string
    title: string
    onDelete?: () => void
  }

const SavedMovieCard = ({ id, poster_path, title, onDelete}: Props) => {
  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image 
                source={{
                    uri: poster_path 
                        ?`https://image.tmdb.org/t/p/w500${poster_path}`
                        : 'https://placehold.co/600x400/1a1a1a/ffffff.png',           
                }}  
                className='w-full h-52 rounded-lg'
                resizeMode='cover'
            />

            <TouchableOpacity 
                onPress={onDelete} 
                className='absolute top-1 right-1 p-1 bg-white rounded-full border-2 border-black'
            >
                <Image 
                    source={icons.trash}
                    className='size-7'
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    </Link>
  )
}

export default SavedMovieCard