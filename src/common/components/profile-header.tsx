import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { User as UserIcon, Crown } from 'lucide-react-native';
import { User, UserUtils } from '../entities/user.entity';

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export default function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
  const fullName = UserUtils.getFullName(user);
  const initials = UserUtils.getInitials(user);
  const subscriptionText = UserUtils.getSubscriptionDisplayText(user.subscriptionType);
  const subscriptionColor = UserUtils.getSubscriptionColor(user.subscriptionType);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{fullName}</Text>
          <View style={styles.subscriptionContainer}>
            {user.subscriptionType === 'premium' && (
              <Crown size={16} color={subscriptionColor} fill={subscriptionColor} />
            )}
            <Text style={[styles.subscription, { color: subscriptionColor }]}>
              {subscriptionText}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.avatarContainer} onPress={onEditProfile}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserIcon size={32} color="#666666" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginLeft: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  userDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscription: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
});
