import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BadgeProps {
  children?: React.ReactNode;
  count?: number;
  maxCount?: number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'rounded' | 'square';
  showZero?: boolean;
  dot?: boolean;
  offset?: [number, number];
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  count = 0,
  maxCount = 99,
  variant = 'default',
  size = 'medium',
  shape = 'rounded',
  showZero = false,
  dot = false,
  offset = [0, 0],
  style,
}) => {
  const { isDark } = useTheme();

  const shouldShowBadge = dot || count > 0 || (showZero && count === 0);
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const getVariantColors = () => {
    const colors = {
      default: {
        background: isDark ? '#6b7280' : '#9ca3af',
        text: '#ffffff',
      },
      primary: {
        background: '#3b82f6',
        text: '#ffffff',
      },
      secondary: {
        background: isDark ? '#4b5563' : '#6b7280',
        text: '#ffffff',
      },
      success: {
        background: '#10b981',
        text: '#ffffff',
      },
      warning: {
        background: '#f59e0b',
        text: '#ffffff',
      },
      error: {
        background: '#ef4444',
        text: '#ffffff',
      },
    };

    return colors[variant];
  };

  const getSizeStyles = () => {
    if (dot) {
      const dotSizes = {
        small: { width: 6, height: 6 },
        medium: { width: 8, height: 8 },
        large: { width: 10, height: 10 },
      };
      return dotSizes[size];
    }

    const sizes = {
      small: {
        minWidth: 16,
        height: 16,
        paddingHorizontal: 4,
        fontSize: 10,
      },
      medium: {
        minWidth: 20,
        height: 20,
        paddingHorizontal: 6,
        fontSize: 12,
      },
      large: {
        minWidth: 24,
        height: 24,
        paddingHorizontal: 8,
        fontSize: 14,
      },
    };

    return sizes[size];
  };

  const getBorderRadius = () => {
    const sizeStyle = getSizeStyles();
    const height = sizeStyle.height || 20;

    switch (shape) {
      case 'circle':
        return height / 2;
      case 'rounded':
        return height * 0.4;
      case 'square':
        return 0;
      default:
        return height * 0.4;
    }
  };

  const getBadgeStyle = (): ViewStyle => {
    const colors = getVariantColors();
    const sizeStyle = getSizeStyles();

    return {
      ...sizeStyle,
      backgroundColor: colors.background,
      borderRadius: getBorderRadius(),
      alignItems: 'center',
      justifyContent: 'center',
      position: children ? 'absolute' : 'relative',
      top: children ? offset[1] : undefined,
      right: children ? offset[0] : undefined,
      zIndex: 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const colors = getVariantColors();
    const sizeStyle = getSizeStyles();
    const fontSize = 'fontSize' in sizeStyle ? sizeStyle.fontSize : 12;

    return {
      color: colors.text,
      fontSize,
      fontWeight: '600',
      lineHeight: fontSize,
    };
  };

  const renderBadge = () => {
    if (!shouldShowBadge) return null;

    return (
      <View style={getBadgeStyle()}>
        {!dot && (
          <Text style={getTextStyle()}>
            {displayCount}
          </Text>
        )}
      </View>
    );
  };

  if (children) {
    return (
      <View style={{ position: 'relative' }}>
        {children}
        {renderBadge()}
      </View>
    );
  }

  return renderBadge();
};

export default Badge;
