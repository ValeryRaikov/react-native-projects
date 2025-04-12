import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { signUp } from '@/services/appwrite';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';
import GoBack from '@/components/GoBack';
import { useTranslation } from 'react-i18next';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { t } = useTranslation();

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert(t('Please fill in all required fields'));
      return;
    }

    if (password !== confirmPassword) {
      alert(t('Passwords do not match'));
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password, username);
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
      alert(t('Signup failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-primary'>
      <Image 
        source={images.bg} 
        className="absolute w-full z-0"
      />
      
      <View className="flex-1 justify-start px-4 pb-10 z-10">
        <Image 
          source={icons.logo} 
          className="w-12 h-10 mt-20 mb-5 mx-auto" 
        />
        
        <Text className='text-light-100 text-center font-semibold text-3xl mb-10'>
          {t('Create Account')}
        </Text>
        
        <View className="space-y-4 mb-6">
          <View className="space-y-2 mb-2">
            <Text className="text-light-200 text-lg">{t('Username')}</Text>
            <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder={t('Enter your username')}
              placeholderTextColor="#A8B5DB"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View className="space-y-2 mb-2">
            <Text className="text-light-200 text-lg">{t('Email')}</Text>
            <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder={t('Enter your email')}
              placeholderTextColor="#A8B5DB"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="space-y-2 mb-2">
            <Text className="text-light-200 text-lg">{t('Password')}</Text>
            <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder={t('Create a password')}
              placeholderTextColor="#A8B5DB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TextInput
              className="w-full bg-secondary-100 py-3 px-4 border-2 border-light-200 rounded-lg text-light-200 text-md"
              placeholder={t('Repeat password')}
              placeholderTextColor="#A8B5DB"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
        </View>
        
        <TouchableOpacity
          className="w-full bg-light-100 py-3 px-4 rounded-lg active:opacity-70"
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <Text className="text-secondary text-center font-bold text-xl">{t('Creating account')}...</Text>
          ) : (
            <Text className="text-secondary text-center font-bold text-xl">{t('Sign Up')}</Text>
          )}
        </TouchableOpacity>
        
        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-light-100 text-xl">{t('Already have an account?')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-white font-semibold text-xl">{t('Login')}</Text>
          </TouchableOpacity>
        </View>

        <GoBack />
      </View>
    </View>
  )
}

export default SignUpScreen