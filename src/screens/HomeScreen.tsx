import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'You have been signed out');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View className={`flex-1 justify-center items-center p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Text className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome to Bill Splitter!
      </Text>
      
      {isAuthenticated && user && (
        <Text className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Hello, {user.name}!
        </Text>
      )}

      <View className="space-y-4 w-full max-w-xs">
        <TouchableOpacity
          className={`py-3 px-6 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text className="text-white text-center font-semibold">
            Go to Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`py-3 px-6 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-500'}`}
          onPress={toggleTheme}
        >
          <Text className="text-white text-center font-semibold">
            Toggle Theme ({isDark ? 'Dark' : 'Light'})
          </Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity
            className="py-3 px-6 rounded-lg bg-red-500"
            onPress={handleSignOut}
          >
            <Text className="text-white text-center font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
