import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../common/components/primary-button';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export default function OnboardingScreen({
  onGetStarted,
}: OnboardingScreenProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Main Image */}
      <Image
        source={require('../../assets/images/onboarding.png')}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* Content Section */}
      <SafeAreaView style={styles.safeContent}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            {/* Main Title */}
            <Text style={styles.title}>{t('onboarding.title')}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
          </View>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={t('onboarding.get_started')}
              onPress={onGetStarted}
              style={styles.getStartedButton}
              textStyle={styles.getStartedButtonText}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeContent: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
    justifyContent: 'flex-end',
  },
  mainImage: {
    width: '100%',
    height: '60%',
  },
  textContainer: {
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  getStartedButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});
