import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const { isDark } = useTheme();

  const getVariantStyles = () => {
    const baseStyle = 'rounded-lg';
    
    if (disabled || loading) {
      return `${baseStyle} ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`;
    }

    switch (variant) {
      case 'primary':
        return `${baseStyle} ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`;
      case 'secondary':
        return `${baseStyle} ${isDark ? 'bg-gray-600' : 'bg-gray-500'}`;
      case 'danger':
        return `${baseStyle} bg-red-500`;
      default:
        return `${baseStyle} ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'py-2 px-4';
      case 'medium':
        return 'py-3 px-6';
      case 'large':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      className={`${getVariantStyles()} ${getSizeStyles()} ${fullWidth ? 'w-full' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className={`text-white text-center font-semibold ${getTextSizeStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
