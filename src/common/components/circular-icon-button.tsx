import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface CircularIconButtonProps {
  Icon: LucideIcon;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  onPress: () => void;
  style?: any;
}

export default function CircularIconButton({
  Icon,
  size = 20,
  iconColor = '#ffffff',
  backgroundColor = '#1a1a1a',
  onPress,
  style,
}: CircularIconButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
    >
      <Icon size={size} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
