import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  emoji: string;
  secondaryEmojis: string[];
  backgroundColor: string;
}

const SimpleOnboardingScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<OnboardingNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Split your bills',
      description: 'Welcome to Splitter! Say goodbye to bill-splitting headaches. Easily divvy up expenses with friends hassle-free.',
      emoji: '📱',
      secondaryEmojis: ['💰', '🧾'],
      backgroundColor: '#4C1D95', // Purple gradient start
    },
    {
      id: '2', 
      title: 'Track expenses effortlessly',
      description: 'Keep track of who owes what with our smart expense tracking. Never lose track of shared costs again.',
      emoji: '📊',
      secondaryEmojis: ['📈', '💳'],
      backgroundColor: '#7C3AED', // Purple gradient middle
    },
    {
      id: '3',
      title: 'Settle up instantly',
      description: 'Send payment reminders and settle debts quickly. Make group payments simple and transparent for everyone.',
      emoji: '✅',
      secondaryEmojis: ['💸', '🤝'],
      backgroundColor: '#A855F7', // Purple gradient end
    },
  ];

  const handleNextPress = () => {
    if (currentPage < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentPage + 1) * width, animated: true });
    } else {
      // Navigate to main app
      navigation.replace('Home');
    }
  };

  const handleSkip = () => {
    // Navigate directly to main app
    navigation.replace('Home');
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const currentIndex = Math.round(contentOffset.x / width);
    setCurrentPage(currentIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    return (
      <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
        <StatusBar barStyle="light-content" backgroundColor={slide.backgroundColor} />
        
        {/* Skip button - only show on first two slides */}
        {index < slides.length - 1 && (
          <View style={styles.skipContainer}>
            <View style={styles.skipButton}>
              <Button
                title="Skip"
                onPress={handleSkip}
                variant="secondary"
                size="small"
              />
            </View>
          </View>
        )}

        {/* Image container */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {/* Main image placeholder */}
            <View style={styles.mainImagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>{slide.emoji}</Text>
            </View>
            
            {/* Secondary images for visual interest */}
            <View style={styles.secondaryImagesContainer}>
              <View style={[styles.secondaryImage, styles.secondaryImage1]}>
                <Text style={styles.secondaryImageText}>{slide.secondaryEmojis[0]}</Text>
              </View>
              <View style={[styles.secondaryImage, styles.secondaryImage2]}>
                <Text style={styles.secondaryImageText}>{slide.secondaryEmojis[1]}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Page indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicator,
                {
                  backgroundColor: idx === index ? '#F59E0B' : 'rgba(255, 255, 255, 0.3)',
                  width: idx === index ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Action button */}
        <View style={styles.actionContainer}>
          <View style={styles.actionButton}>
            <Button
              title={index === slides.length - 1 ? "Let's get started!" : 'Next'}
              onPress={handleNextPress}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    width,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  imageWrapper: {
    position: 'relative',
    width: width * 0.8,
    height: height * 0.4,
  },
  mainImagePlaceholder: {
    width: '70%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  secondaryImagesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  secondaryImage: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryImage1: {
    top: '10%',
    left: '10%',
  },
  secondaryImage2: {
    bottom: '15%',
    right: '5%',
  },
  secondaryImageText: {
    fontSize: 32,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  actionContainer: {
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 25,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
});

export default SimpleOnboardingScreen;
