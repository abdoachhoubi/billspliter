import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'surface';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'custom';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  label,
  size = 'medium',
  variant = 'primary',
  position = 'bottom-right',
  disabled = false,
  loading = false,
  style,
}) => {
  const { isDark } = useTheme();

  const getSizeStyles = (): ViewStyle => {
    const sizes = {
      small: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      medium: {
        width: 56,
        height: 56,
        borderRadius: 28,
      },
      large: {
        width: 64,
        height: 64,
        borderRadius: 32,
      },
    };

    if (label) {
      return {
        ...sizes[size],
        width: undefined,
        minWidth: sizes[size].width,
        paddingHorizontal: 16,
        borderRadius: sizes[size].borderRadius,
      };
    }

    return sizes[size];
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? (isDark ? '#4b5563' : '#d1d5db') : '#3b82f6',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? (isDark ? '#374151' : '#f3f4f6') : (isDark ? '#4b5563' : '#6b7280'),
        };
      case 'surface':
        return {
          backgroundColor: disabled ? (isDark ? '#374151' : '#f3f4f6') : (isDark ? '#1f2937' : '#ffffff'),
          borderWidth: 1,
          borderColor: isDark ? '#374151' : '#e5e7eb',
        };
      default:
        return {
          backgroundColor: disabled ? (isDark ? '#4b5563' : '#d1d5db') : '#3b82f6',
        };
    }
  };

  const getPositionStyles = (): ViewStyle => {
    const basePosition = {
      position: 'absolute' as const,
      margin: 16,
    };

    switch (position) {
      case 'bottom-right':
        return {
          ...basePosition,
          bottom: 0,
          right: 0,
        };
      case 'bottom-left':
        return {
          ...basePosition,
          bottom: 0,
          left: 0,
        };
      case 'bottom-center':
        return {
          ...basePosition,
          bottom: 0,
          alignSelf: 'center',
        };
      case 'custom':
        return {};
      default:
        return {
          ...basePosition,
          bottom: 0,
          right: 0,
        };
    }
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      ...getSizeStyles(),
      ...getVariantStyles(),
      ...getPositionStyles(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: disabled ? 0 : 0.3,
      shadowRadius: 8,
      elevation: disabled ? 0 : 8,
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const iconColor = variant === 'surface' 
      ? (isDark ? '#f9fafb' : '#111827')
      : '#ffffff';

    return {
      color: iconColor,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: icon ? 8 : 0,
    };
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {icon && (
        <View>
          {icon}
        </View>
      )}
      
      {label && (
        <Text style={getTextStyle()}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default FAB;
