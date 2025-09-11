import { BadgeCent, Crown, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User, UserUtils } from '../entities/user.entity';

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export default function ProfileHeader({
  user,
  onEditProfile,
}: ProfileHeaderProps) {
  const fullName = UserUtils.getFullName(user);
  const initials = UserUtils.getInitials(user);
  const subscriptionText = UserUtils.getSubscriptionDisplayText(
    user.subscriptionType
  );
  const subscriptionColor = UserUtils.getSubscriptionColor(
    user.subscriptionType
  );
  const badgeBackgroundColor =
    user.subscriptionType === 'premium' ? '#FFD700' : '#666666';
  const badgeTextColor =
    user.subscriptionType === 'premium' ? '#000000' : '#ffffff';

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{fullName}</Text>
          <View
            style={[
              styles.subscriptionBadge,
              { backgroundColor: badgeBackgroundColor },
            ]}
          >
            {user.subscriptionType === 'premium' ? (
              <Crown size={14} color={badgeTextColor} fill={badgeTextColor} />
            ) : (
              <BadgeCent size={14} color={badgeTextColor} />
            )}
            <Text style={[styles.subscriptionText, { color: badgeTextColor }]}>
              {subscriptionText}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onEditProfile}
        >
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
    marginBottom: 8,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
