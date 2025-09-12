import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export class OnboardingService {
  /**
   * Check if user has completed onboarding
   */
  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }

  /**
   * Reset onboarding status (useful for testing)
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }
}
