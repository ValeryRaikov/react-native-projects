import { Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
import { useRouter } from 'expo-router';

const GoBack = () => {
    const router = useRouter();

    return (
        <TouchableOpacity 
            className='absolute bottom-5 left-0 rigth-0 mx-5 bg-accent rounded-lg py-3.5 felx-row items-center justify-center z-50'
            onPress={router.back}
        >
            <Image 
                source={icons.arrow}
                className='size-5 mr-1 mt-0.5 rotate-180'
                tintColor='#fff'
            />
            <Text className='text-white font-semibold text-base'>Go back</Text>
        </TouchableOpacity>
    )
}

export default GoBack