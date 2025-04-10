import { View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import { getCurrentUser } from '@/services/appwrite';
import { router } from 'expo-router';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    fetchUser()
  }, []);

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
              <Text className='text-light-200 text-center'>
                {user.email}
              </Text>
            </View>

            <TouchableOpacity
              className="w-full py-3 px-4 rounded-lg"
              onPress={() => router.replace('/(auth)')}
            >
              <Text className="text-white text-center font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className='text-light-200 text-center text-xl'>
              Currently you are logged in as guest!
            </Text>

            <TouchableOpacity
              className="w-full bg-secondary-100 py-3 px-4 rounded-lg border-2 border-white"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-white text-center font-semibold text-lg">Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="w-full bg-white py-3 px-4 rounded-lg border-2 border-secondary-100"
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text className="text-secondary-100 text-center font-semibold text-lg">Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

export default Profile