import '@/services/i18n';

import { View, Image, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const Index = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'bg' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <View className='flex-1 bg-primary'>
            <Image 
                source={images.bg} 
                className="absolute w-full z- 0"
            />

            <View className="flex-1 justify-start px-4 pb-10 z-10">
                <Image 
                    source={icons.logo} 
                    className="w-12 h-10 mt-20 mb-5 mx-auto" 
                />
                <Text className='text-light-100 text-center font-semibold text-3xl mb-10'>
                    {t('Welcome to movieApp')}
                </Text>

                <TouchableOpacity
                    className='absolute top-2 right-2 p-3 bg-secondary rounded-full'
                    onPress={toggleLanguage}
                >
                    <Text className="text-white text-lg font-semibold">
                        {i18n.language === 'en' ? 'BG' : 'EN'}
                    </Text>
                </TouchableOpacity>
                
                <View className="flex-column justify-center items-center gap-2 space-y-4">
                    <TouchableOpacity
                        className="w-full bg-secondary-100 py-3 px-4 rounded-lg border-2 border-white"
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text className="text-white text-center font-semibold text-lg">{t('Login')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        className="w-full bg-white py-3 px-4 rounded-lg border-2 border-secondary-100"
                        onPress={() => router.push('/(auth)/signup')}
                    >
                        <Text className="text-secondary-100 text-center font-semibold text-lg">{t('Sign Up')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        className="w-full py-3 px-4 rounded-lg"
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Text className="text-white text-center font-semibold text-lg underline">
                            {t('Continue as Guest')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Index