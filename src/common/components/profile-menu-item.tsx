import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ProfileMenuItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  iconColor?: string;
  backgroundColor?: string;
}

export default function ProfileMenuItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  iconColor = '#ffffff',
  backgroundColor = '#1a1a1a',
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={iconColor} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        
        {showChevron && (
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 18,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '300',
  },
});
