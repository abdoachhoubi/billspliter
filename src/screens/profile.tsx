import { Globe, Heart, LogOut, Wallet, Grid3x3, Users, CreditCard, Shield, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ProfileHeader,
  ProfileMenuItem,
} from '../common/components';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../common/constants/theme';
import { User as UserType } from '../common/entities/user.entity';
import { createNavigationHandler, createConditionalHandler } from '../common/utils/navigation';

interface ProfileScreenProps {
  onLanguageSettings?: () => void;
  onLogout?: () => void;
}

interface ActionCard {
  key: string;
  translationKey: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

// Mock user data - in a real app, this would come from state management or API
const MOCK_USER: UserType = {
  id: '1',
  firstName: 'David',
  lastName: 'Saito',
  email: 'david.saito@example.com',
  phone: '+1 (555) 123-4567',
  rating: 5.0,
  totalBills: 42,
  totalSpent: 1250.5,
  joinedDate: new Date('2024-01-15'),
  subscriptionType: 'premium',
  preferences: {
    currency: 'USD',
    language: 'en',
    notifications: {
      billReminders: true,
      paymentRequests: true,
      activityUpdates: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'friends',
      showEmail: false,
      showPhone: false,
      showActivity: true,
    },
  },
};

export default function ProfileScreen({
  onLanguageSettings,
  onLogout,
}: ProfileScreenProps) {
  const { t } = useTranslation();
  const [user] = useState<UserType>(MOCK_USER);

  // Action handlers using utility functions
  const handleLanguageSettings = createConditionalHandler(
    onLanguageSettings, 
    'Language settings'
  );

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logout_message'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: () => {
          if (onLogout) {
            onLogout();
          } else {
            console.log('Logout confirmed');
          }
        },
      },
    ]);
  };

  // Action cards configuration
  const actionCards: ActionCard[] = [
    {
      key: 'favorites',
      translationKey: 'profile.favorites',
      icon: Heart,
      onPress: createNavigationHandler('Favorites'),
    },
    {
      key: 'language',
      translationKey: 'profile.language',
      icon: Globe,
      onPress: handleLanguageSettings,
    },
    {
      key: 'currency',
      translationKey: 'profile.currency',
      icon: Wallet,
      onPress: createNavigationHandler('Currency settings'),
    },
    {
      key: 'categories',
      translationKey: 'profile.categories',
      icon: Grid3x3,
      onPress: createNavigationHandler('Categories'),
    },
    {
      key: 'contacts',
      translationKey: 'profile.contacts',
      icon: Users,
      onPress: createNavigationHandler('Contacts'),
    },
    {
      key: 'plan',
      translationKey: 'profile.plan',
      icon: CreditCard,
      onPress: createNavigationHandler('Plan'),
    },
  ];

  const renderActionCard = (card: ActionCard) => (
    <TouchableOpacity
      key={card.key}
      style={styles.actionCard}
      onPress={card.onPress}
    >
      <Text style={styles.actionCardText}>{t(card.translationKey)}</Text>
      <card.icon size={26} color="#666666" style={styles.actionCardIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Content */}
        <View style={styles.topContent}>
          {/* Profile Header */}
          <ProfileHeader 
            user={user} 
            onEditProfile={createNavigationHandler('Edit profile')} 
          />

          {/* Actions Section */}
          <View style={styles.rowSection}>
            {actionCards.slice(0 ,3).map(renderActionCard)}
          </View>
          <View style={styles.rowSection}>
            {actionCards.slice(3 ,6).map(renderActionCard)}
          </View>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Menu Items */}
          <View style={styles.section}>
            <ProfileMenuItem
              icon={Shield}
              title={t('profile.privacy_policy')}
              onPress={createNavigationHandler('Privacy Policy')}
              showChevron={true}
            />
            <ProfileMenuItem
              icon={Trash2}
              title={t('profile.delete_account')}
              onPress={createNavigationHandler('Delete Account')}
              showChevron={true}
              iconColor="#ff4444"
            />
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <ProfileMenuItem
              icon={LogOut}
              title={t('profile.logout')}
              onPress={handleLogout}
              showChevron={false}
              iconColor="#ff4444"
            />
          </View>

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    flex: 0,
  },
  bottomContent: {
    flex: 0,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  rowSection: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    height: 80,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  actionCardText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    alignSelf: 'flex-start',
  },
  actionCardIcon: {
    alignSelf: 'flex-end',
  },
  bottomSpacing: {
    height: 100, // Space for bottom navigation
  },
});
