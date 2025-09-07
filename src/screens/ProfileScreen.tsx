import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user, signIn, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await signIn(email, password);
      Alert.alert('Success', 'You have been signed in!');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    }
  };

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Profile
        </Text>

        {isAuthenticated && user ? (
          <View className="space-y-4">
            <View className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                User Information
              </Text>
              <Text className={`mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                ID: {user.id}
              </Text>
              <Text className={`mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Name: {user.name}
              </Text>
              <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Email: {user.email}
              </Text>
            </View>

            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-center font-semibold">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            <Text className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Please sign in to view your profile
            </Text>

            <View>
              <Text className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Email
              </Text>
              <TextInput
                className={`border rounded-lg p-3 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Enter your email"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Password
              </Text>
              <TextInput
                className={`border rounded-lg p-3 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${isDark ? 'bg-green-600' : 'bg-green-500'}`}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-500'}`}
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white text-center font-semibold">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
