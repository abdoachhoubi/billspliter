import {
  Briefcase,
  FileText,
  Globe,
  Heart,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  User,
  Wallet,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ProfileHeader,
  ProfileMenuItem,
  ProfileStats,
} from '../common/components';
import { User as UserType } from '../common/entities/user.entity';

// Mock user data - in a real app, this would come from state management or API
const mockUser: UserType = {
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

interface ProfileScreenProps {
  onLanguageSettings?: () => void;
  onLogout?: () => void;
}

export default function ProfileScreen({
  onLanguageSettings,
  onLogout,
}: ProfileScreenProps) {
  const { t } = useTranslation();
  const [user] = useState<UserType>(mockUser);

  const handleFavorites = () => {
    // TODO: Navigate to favorites screen
    console.log('Favorites pressed');
  };

  const handleLanguage = () => {
    if (onLanguageSettings) {
      onLanguageSettings();
    } else {
      console.log('Language settings pressed');
    }
  };

  const handleCurrency = () => {
    // TODO: Navigate to currency settings
    console.log('Currency settings pressed');
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile pressed');
  };

  const handleHelp = () => {
    // TODO: Navigate to help screen
    console.log('Help pressed');
  };

  const handleStats = () => {
    // TODO: Navigate to stats screen
    console.log('Stats pressed');
  };

  const handlePrivacyCheckup = () => {
    // TODO: Navigate to privacy checkup
    console.log('Privacy checkup pressed');
  };

  const handleSettings = () => {
    if (onLanguageSettings) {
      onLanguageSettings();
    } else {
      console.log('Settings pressed');
    }
  };

  const handleMessages = () => {
    // TODO: Navigate to messages screen
    console.log('Messages pressed');
  };

  const handleBusinessProfile = () => {
    // TODO: Navigate to business profile setup
    console.log('Business profile pressed');
  };

  const handleManageAccount = () => {
    // TODO: Navigate to account management
    console.log('Manage account pressed');
  };

  const handleLegal = () => {
    // TODO: Navigate to legal documents
    console.log('Legal pressed');
  };

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

  const quickStats = [
    {
      value: user.totalBills?.toString() || '0',
      label: t('profile.total_bills'),
      subtitle: t('profile.this_month'),
      onPress: handleStats,
      showAddButton: true,
    },
    {
      value: user.totalSpent?.toFixed(0) || '0',
      unit: '$',
      label: t('profile.total_spent'),
      subtitle: t('profile.this_month'),
      onPress: handleStats,
      showAddButton: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader user={user} onEditProfile={handleEditProfile} />

        {/* Quick Stats */}
        <View style={styles.section}>
          <ProfileStats stats={quickStats} />
        </View>

        {/* Actions Section */}
        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.actionCard} onPress={handleFavorites}>
            <Text style={styles.actionCardText}>{t('profile.favorites')}</Text>
            <Heart size={26} color="#666666" style={styles.actionCardIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleLanguage}>
            <Text style={styles.actionCardText}>{t('profile.language')}</Text>
            <Globe size={26} color="#666666" style={styles.actionCardIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleCurrency}>
            <Text style={styles.actionCardText}>{t('profile.currency')}</Text>
            <Wallet size={26} color="#666666" style={styles.actionCardIcon} />
          </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    height: 80,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  actionCardText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  actionCardIcon: {
    alignSelf: 'flex-end',
  },
  bottomSpacing: {
    height: 100, // Space for bottom navigation
  },
});
