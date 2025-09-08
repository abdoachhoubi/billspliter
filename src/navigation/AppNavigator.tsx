import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ModernOnboardingScreen from '../screens/ModernOnboardingScreen';
import FlashListDemo from '../screens/FlashListDemo';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
            },
            headerTintColor: isDark ? '#ffffff' : '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Onboarding"
            component={ModernOnboardingScreen}
            options={{ 
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Bill Splitter' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: t('navigation.profile') }}
          />
          <Stack.Screen
            name="FlashListDemo"
            component={FlashListDemo}
            options={{ title: 'FlashList Demo' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigator;
