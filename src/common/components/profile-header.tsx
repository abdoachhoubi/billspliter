import { Crown, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';
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
            {user.subscriptionType === 'premium' && (
              <Crown size={14} color={badgeTextColor} fill={badgeTextColor} />
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
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBackground,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginLeft: SPACING.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.round,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  userDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.xs,
  },
});
