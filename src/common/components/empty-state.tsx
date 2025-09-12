import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Add, People } from 'iconsax-react-nativejs';

interface EmptyStateProps {
  message: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  actionText?: string;
  onAction?: () => void;
  style?: any;
}

export default function EmptyState({
  message,
  subtitle,
  icon: IconComponent = People,
  actionText,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <IconComponent size={48} color="#666666" />
      <Text style={styles.title}>{message}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Add size={20} color="#000000" />
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
});
