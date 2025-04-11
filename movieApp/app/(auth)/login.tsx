import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { login } from '../../services/appwrite';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';
import GoBack from '@/components/GoBack';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Welcome back
        </Text>
        
        <View className="space-y-4 mb-6">
          <View className="space-y-2 mb-2">
            <Text className="text-light-200 text-lg">Email</Text>
            <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder="Enter your email"
              placeholderTextColor="#A8B5DB"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="space-y-2">
            <Text className="text-light-200 text-lg">Password</Text>
            <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder="Enter your password"
              placeholderTextColor="#A8B5DB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <TouchableOpacity
          className="w-full bg-light-100 py-3 px-4 rounded-lg active:opacity-70"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text className="text-secondary text-center font-bold text-xl">Loading...</Text>
          ) : (
            <Text className="text-secondary text-center font-bold text-xl">Login</Text>
          )}
        </TouchableOpacity>
        
        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-light-100 text-xl">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-white font-semibold text-xl">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <GoBack />
      </View>
    </View>
  )
}

export default LoginScreen