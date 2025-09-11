import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react-native';

interface HomeScreenProps {
  onLanguageSettings?: () => void;
}

export default function HomeScreen({ onLanguageSettings }: HomeScreenProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>
          {t('home.subtitle')}
        </Text>
        
        {onLanguageSettings && (
          <TouchableOpacity
            style={styles.languageButton}
            onPress={onLanguageSettings}
          >
            <View style={styles.languageButtonContent}>
              <Languages size={20} color="#000000" />
              <Text style={styles.languageButtonText}>
                {t('language_settings.title')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  languageButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#ffffff',
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
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
