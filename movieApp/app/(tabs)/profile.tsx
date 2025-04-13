import { View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { icons } from '@/constants/icons'
import { getCurrentUser, logout } from '@/services/appwrite';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import useModal from '@/hooks/useModal';
import AlertModal from '@/components/AlertModal';

const Profile = () => {
  const { user, setUser, loading } = useAuth();

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
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
  
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);          
      router.replace('/(auth)');
    } catch (err) {
      showModal(t('Error'), t('Failed to log out. Please try again.'), 'error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View className='bg-primary flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 gap-5'>
        <Image 
          source={icons.person}
          className='size-10'
          tintColor='#fff'
        />

        {user ? (
          <>
            <View className='items-center'>
              <Text className='text-xl font-semibold text-white text-center'>
                {user.name}
              </Text>
              <Text className='text-lg font-semibold text-light-200 text-center'>
                {user.email}
              </Text>
            </View>

            <TouchableOpacity
              className="w-full py-3 px-4 rounded-lg"
              onPress={handleLogout}
            >
              <Text className="text-2xl font-semibold text-light-100 text-center">{t('Logout')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className='text-light-200 text-center text-xl'>
              {t('Currently you are logged in as guest!')}
            </Text>

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
          </>
        )}
      </View>

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

export default Profile