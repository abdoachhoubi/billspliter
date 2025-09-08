import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const ModernOnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<OnboardingNavigationProp>();

  const handleGetStarted = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Top Section with Illustration */}
      <View style={styles.topSection}>
          <Image
            source={require('../../assets/onboarding/onboarding.png')}
            style={styles.illustration}
            resizeMode="cover"
          />
      </View>

      {/* Bottom Section with Content */}
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Split Bills with Friends Effortlessly! 💰
          </Text>
          
          <Text style={styles.description}>
            Make group expenses simple and fair. Track, split, and settle bills with your friends in just a few taps.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Let's Start!"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
	flex: 1,
	height: '100%',
    backgroundColor: 'rgba(248, 249, 250, 1)',
  },
  topSection: {
	flex:.7,
	width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '90%',
  },
  bottomSection: {
	flex: .3,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,

  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default ModernOnboardingScreen;
