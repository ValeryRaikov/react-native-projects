import { View, Text } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function Home() {
  const { user } = useUser();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.emailAddresses[0].emailAddress} 🎉</Text>
    </View>
  );
};