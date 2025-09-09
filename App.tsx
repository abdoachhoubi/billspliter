import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Languages } from 'lucide-react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import LanguageSettingsScreen from './src/screens/language-settings';
import ContactsScreen from '@/screens/contacts';

function AppContent() {
  const { t } = useTranslation();
  const { currentLanguage, isCurrentRTL } = useLanguage();
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);

  if (showLanguageSettings) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, isCurrentRTL && styles.backButtonRTL]}
          onPress={() => setShowLanguageSettings(false)}
        >
          {isCurrentRTL ? (
            <View style={styles.rtlBackButton}>
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
              <ChevronRight size={20} color="#3b82f6" />
            </View>
          ) : (
            <View style={styles.ltrBackButton}>
              <ChevronLeft size={20} color="#3b82f6" />
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </View>
          )}
        </TouchableOpacity>
        <LanguageSettingsScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.appTitle, isCurrentRTL && { textAlign: 'center', writingDirection: 'rtl' }]}>
          {t('app.title')}
        </Text>
        
        <View style={styles.languageInfo}>
          <Text style={styles.currentLangLabel}>
            {t('language_settings.current_language')}:
          </Text>
          <Text style={styles.currentLang}>
            {currentLanguage.flag} {currentLanguage.nativeName}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageSettings(true)}
        >
          <View style={styles.languageButtonContent}>
            <Languages size={16} color="#3b82f6" />
            <Text style={styles.languageButtonText}>{t('language_settings.title')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        } 
        persistor={persistor}
      >
        <LanguageProvider>
          {/* <AppContent /> */}
          <ContactsScreen />
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  hello: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  languageInfo: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLangLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  currentLang: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  languageButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
  },
  backButtonRTL: {
    alignItems: 'flex-end',
  },
  rtlBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ltrBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
});
