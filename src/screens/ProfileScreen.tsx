import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { user, signIn, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('profile.emailRequired'));
      return;
    }

    try {
      await signIn(email, password);
      Alert.alert(t('common.success'), t('profile.signInSuccess'));
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.signInError'));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#ffffff',
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      color: isDark ? '#ffffff' : '#111827',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#111827' : '#ffffff',
    },
    loadingText: {
      fontSize: 18,
      color: isDark ? '#ffffff' : '#111827',
    },
    userInfoContainer: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
      marginBottom: 16,
    },
    userInfoTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: isDark ? '#ffffff' : '#111827',
    },
    userInfoText: {
      marginBottom: 4,
      color: isDark ? '#d1d5db' : '#6b7280',
    },
    signInText: {
      fontSize: 18,
      marginBottom: 16,
      color: isDark ? '#d1d5db' : '#6b7280',
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      marginBottom: 8,
      color: isDark ? '#ffffff' : '#111827',
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#111827',
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    primaryButton: {
      backgroundColor: isDark ? '#2563eb' : '#3b82f6',
    },
    secondaryButton: {
      backgroundColor: isDark ? '#4b5563' : '#6b7280',
    },
    successButton: {
      backgroundColor: isDark ? '#059669' : '#10b981',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        {isAuthenticated && user ? (
          <View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoTitle}>{t('profile.userInformation')}</Text>
              <Text style={styles.userInfoText}>{t('profile.id')}: {user.id}</Text>
              <Text style={styles.userInfoText}>{t('profile.name')}: {user.name}</Text>
              <Text style={styles.userInfoText}>{t('profile.email')}: {user.email}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>{t('profile.backToHome')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.signInText}>
              {t('profile.signInPrompt')}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('profile.email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('profile.emailPlaceholder')}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('profile.password')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('profile.passwordPlaceholder')}
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.successButton]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? t('profile.signingIn') : t('profile.signIn')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>{t('profile.backToHome')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
