import React from 'react'
import { Tabs } from 'expo-router'
import TabIcon from '@/components/TabIcon'
import { icons } from '@/constants/icons'
import { useTranslation } from 'react-i18next'

const _Layout = () => {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabBarStyle: {
            backgroundColor: '#0f0d23',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 52,
            position: 'absolute',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#0f0d23',
        }
    }}>
        <Tabs.Screen
            name="index"
            options={{ 
                title: "Home", 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.home} 
                        title={t('Home')}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="search"
            options={{ 
                title: "Search", 
                headerShown: false, 
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.search} 
                        title={t('Search')} 
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="saved"
            options={{ 
                title: "Saved", 
                headerShown: false, 
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.save} 
                        title={t('Saved')} 
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{ 
                title: "Profile", 
                headerShown: false, 
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused} 
                        icon={icons.person} 
                        title={t('Profile')} 
                    />
                ),
            }}
        />
    </Tabs>
  )
}

export default _Layout