import { ImageBackground, Image, Text, View } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'


const TabIcon = ({ focused, icon, title }: any) => {
    return focused ? (
        <ImageBackground 
            source={images.highlight}
            className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
        >
            <Image source={icon} tintColor="#151312" className='size-5' />
            <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
        </ImageBackground>
        ) : (
           <View className='size-full justify-center items-center mt-4 rounded-full'>
                <Image source={icon} tintColor="#A8B5DB" className='size-5' />
           </View> 
        );
}

export default TabIcon