import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguagePicker from '../components/LanguagePicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark, toggleTheme, theme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const { changeLanguage, currentLanguage, availableLanguages, isCurrentLanguageRTL } = useLanguage();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang?.nativeName || 'English';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert(t('common.success'), t('home.signOutSuccess'));
    } catch (error) {
      Alert.alert(t('common.error'), t('home.signOutError'));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#111827' : '#ffffff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 32,
      color: isDark ? '#ffffff' : '#111827',
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 16,
      color: isDark ? '#d1d5db' : '#6b7280',
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 300,
      gap: 16,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: isDark ? '#2563eb' : '#3b82f6',
    },
    secondaryButton: {
      backgroundColor: isDark ? '#4b5563' : '#6b7280',
    },
    dangerButton: {
      backgroundColor: '#ef4444',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      
      {isAuthenticated && user && (
        <Text style={styles.subtitle}>{t('home.greeting', { name: user.name })}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>{t('home.goToProfile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={toggleTheme}
        >
          <Text style={styles.buttonText}>
            {t('home.toggleTheme', { theme: t(`theme.${theme}`) })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setShowLanguagePicker(true)}
        >
          <Text style={styles.buttonText}>
            🌐 {getCurrentLanguageName()}
          </Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>{t('home.signOut')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <LanguagePicker
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
      />
    </View>
  );
};

export default HomeScreen;
