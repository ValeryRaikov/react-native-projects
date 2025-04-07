import { Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SavedMovieCard = ({ id, poster_path, title}: Movie) => {
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

            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    </Link>
  )
}

export default SavedMovieCard