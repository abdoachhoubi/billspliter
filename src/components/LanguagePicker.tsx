import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
    const { changeLanguage, currentLanguage, availableLanguages, isCurrentLanguageRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = availableLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getLanguageFlag = (code: string): string => {
    const flags: { [key: string]: string } = {
      en: '🇺🇸', // English (US)
      es: '🇪🇸', // Spanish
      fr: '🇫🇷', // French
      ar: '🇸🇦', // Arabic
      de: '🇩🇪', // German
      ru: '🇷🇺', // Russian
      zh: '🇨🇳', // Chinese
      ja: '🇯🇵', // Japanese
      el: '🇬🇷', // Greek
      hi: '🇮🇳', // Hindi
    };
    return flags[code] || '🌐';
  };

  const renderLanguageItem = ({ item }: { item: any }) => {
    const isSelected = currentLanguage === item.code;
    
    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
          },
          isSelected && {
            backgroundColor: isDark ? '#2563eb' : '#3b82f6',
            borderColor: isDark ? '#3b82f6' : '#2563eb',
          },
        ]}
        onPress={() => handleLanguageSelect(item.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageContent}>
          <View style={styles.languageInfo}>
            <Text style={styles.flagText}>{getLanguageFlag(item.code)}</Text>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.languageText,
                  { 
                    color: isDark ? '#ffffff' : '#111827',
                  },
                  isSelected && { color: '#ffffff' },
                ]}
              >
                {item.nativeName}
              </Text>
              <Text
                style={[
                  styles.languageSubtext,
                  { 
                    color: isDark ? '#d1d5db' : '#6b7280',
                  },
                  isSelected && { color: '#e5e7eb' },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: isDark ? '#374151' : '#e5e7eb' }]}>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
            {t('common.selectLanguage')}
          </Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: isDark ? '#ffffff' : '#111827',
                backgroundColor: 'transparent',
              }
            ]}
            placeholder={t('common.searchLanguage')}
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Language List */}
        <FlatList
          data={filteredLanguages}
          keyExtractor={(item) => item.code}
          renderItem={renderLanguageItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: isDark ? '#374151' : '#e5e7eb' }]}>
          <TouchableOpacity
            style={[styles.footerButton, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
            onPress={onClose}
          >
            <Text style={[styles.footerButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  languageItem: {
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagText: {
    fontSize: 24,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageSubtext: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LanguagePicker;
