import React from 'react';
import { View, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  disabled?: boolean;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  disabled = false,
  style,
}) => {
  const { isDark } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    };

    // Padding styles
    const paddingStyles = {
      none: {},
      small: { padding: 8 },
      medium: { padding: 16 },
      large: { padding: 24 },
    };

    // Margin styles
    const marginStyles = {
      none: {},
      small: { margin: 4 },
      medium: { margin: 8 },
      large: { margin: 16 },
    };

    // Border radius styles
    const borderRadiusStyles = {
      none: { borderRadius: 0 },
      small: { borderRadius: 4 },
      medium: { borderRadius: 8 },
      large: { borderRadius: 16 },
      full: { borderRadius: 9999 },
    };

    // Variant styles
    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'elevated':
        variantStyle = {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
        break;
      case 'outlined':
        variantStyle = {
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#e5e7eb',
        };
        break;
      default:
        variantStyle = {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 2,
          elevation: 1,
        };
    }

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...borderRadiusStyles[borderRadius],
      ...variantStyle,
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  };

  const cardStyle = getCardStyle();

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

export default Card;
