import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { languages, changeLanguage, isRTL } from '../i18n';
import { useLanguage } from '../context/LanguageContext';

const LanguageSettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, isCurrentRTL, refreshLanguage } = useLanguage();

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      refreshLanguage(); // Update the context
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderLanguageOption = (langCode: string) => {
    const langInfo = languages[langCode as keyof typeof languages];
    const isSelected = currentLanguage.code === langCode;

    return (
      <TouchableOpacity
        key={langCode}
        style={[styles.languageOption, isSelected && styles.selectedLanguage]}
        onPress={() => handleLanguageChange(langCode)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{langInfo.flag}</Text>
          <View style={styles.languageTexts}>
            <Text style={[
              styles.languageName, 
              isSelected && styles.selectedText
            ]}>
              {langInfo.name}
            </Text>
            <Text style={[
              styles.nativeName, 
              isSelected && styles.selectedText
            ]}>
              {langInfo.nativeName}
            </Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isCurrentRTL && { textAlign: 'right' }]}>
        {t('language_settings.title')}
      </Text>
      
      <View style={styles.currentLanguageSection}>
        <Text style={[styles.sectionTitle, isCurrentRTL && { textAlign: 'right' }]}>
          {t('language_settings.current_language')}
        </Text>
        <View style={styles.currentLanguageCard}>
          <Text style={styles.currentLanguageFlag}>{currentLanguage.flag}</Text>
          <Text style={styles.currentLanguageName}>
            {currentLanguage.name}
          </Text>
          <Text style={styles.currentLanguageNative}>
            ({currentLanguage.nativeName})
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isCurrentRTL && { textAlign: 'right' }]}>
        {t('language_settings.select_language')}
      </Text>
      
      <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
        {Object.keys(languages).map(renderLanguageOption)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  currentLanguageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
  },
  currentLanguageCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLanguageFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  currentLanguageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  currentLanguageNative: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedLanguage: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOpacity: 0.3,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  nativeName: {
    fontSize: 14,
    color: '#888888',
  },
  selectedText: {
    color: '#000000',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LanguageSettingsScreen;