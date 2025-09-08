import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ChipProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: 'filled' | 'outlined' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  style?: ViewStyle;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onDelete,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  selected = false,
  disabled = false,
  leftIcon,
  rightIcon,
  deleteIcon,
  style,
}) => {
  const { isDark } = useTheme();

  const getColorScheme = () => {
    const schemes = {
      default: {
        background: isDark ? '#374151' : '#f3f4f6',
        text: isDark ? '#f9fafb' : '#111827',
        border: isDark ? '#4b5563' : '#d1d5db',
      },
      primary: {
        background: '#3b82f6',
        text: '#ffffff',
        border: '#3b82f6',
      },
      secondary: {
        background: isDark ? '#4b5563' : '#6b7280',
        text: '#ffffff',
        border: isDark ? '#4b5563' : '#6b7280',
      },
      success: {
        background: '#10b981',
        text: '#ffffff',
        border: '#10b981',
      },
      warning: {
        background: '#f59e0b',
        text: '#ffffff',
        border: '#f59e0b',
      },
      error: {
        background: '#ef4444',
        text: '#ffffff',
        border: '#ef4444',
      },
    };

    return schemes[color];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        height: 24,
        paddingHorizontal: 8,
        fontSize: 12,
        iconSize: 14,
      },
      medium: {
        height: 32,
        paddingHorizontal: 12,
        fontSize: 14,
        iconSize: 16,
      },
      large: {
        height: 40,
        paddingHorizontal: 16,
        fontSize: 16,
        iconSize: 18,
      },
    };

    return sizes[size];
  };

  const getChipStyle = (): ViewStyle => {
    const colorScheme = getColorScheme();
    const sizeStyle = getSizeStyles();

    let backgroundColor: string;
    let borderColor: string;
    let borderWidth = 0;

    switch (variant) {
      case 'filled':
        backgroundColor = selected ? colorScheme.background : colorScheme.background;
        break;
      case 'outlined':
        backgroundColor = 'transparent';
        borderColor = colorScheme.border;
        borderWidth = 1;
        break;
      case 'ghost':
        backgroundColor = selected 
          ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
          : 'transparent';
        break;
      default:
        backgroundColor = colorScheme.background;
    }

    return {
      height: sizeStyle.height,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      borderRadius: sizeStyle.height / 2,
      backgroundColor,
      borderWidth,
      borderColor: borderColor!,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const colorScheme = getColorScheme();
    const sizeStyle = getSizeStyles();

    let textColor: string;

    switch (variant) {
      case 'outlined':
        textColor = colorScheme.background;
        break;
      case 'ghost':
        textColor = colorScheme.background;
        break;
      default:
        textColor = colorScheme.text;
    }

    return {
      fontSize: sizeStyle.fontSize,
      fontWeight: '500',
      color: textColor,
    };
  };

  const renderContent = () => (
    <View style={getChipStyle()}>
      {leftIcon && (
        <View style={{ marginRight: 6 }}>
          {leftIcon}
        </View>
      )}
      
      <Text style={getTextStyle()}>
        {label}
      </Text>
      
      {rightIcon && (
        <View style={{ marginLeft: 6 }}>
          {rightIcon}
        </View>
      )}
      
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{ marginLeft: 6 }}
          disabled={disabled}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {deleteIcon || (
            <Text style={[getTextStyle(), { fontSize: getSizeStyles().iconSize }]}>
              ×
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

export default Chip;
