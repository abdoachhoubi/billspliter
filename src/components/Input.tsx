import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  required = false,
  ...textInputProps
}) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    return {
      width: fullWidth ? '100%' : undefined,
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
    };

    const sizeStyles = {
      small: { minHeight: 36, paddingHorizontal: 12 },
      medium: { minHeight: 44, paddingHorizontal: 16 },
      large: { minHeight: 52, paddingHorizontal: 20 },
    };

    let borderColor: string;
    let backgroundColor: string;

    if (error) {
      borderColor = '#ef4444';
    } else if (isFocused) {
      borderColor = '#3b82f6';
    } else {
      borderColor = isDark ? '#4b5563' : '#d1d5db';
    }

    switch (variant) {
      case 'filled':
        backgroundColor = isDark ? '#374151' : '#f3f4f6';
        return {
          ...baseStyle,
          ...sizeStyles[size],
          backgroundColor,
          borderWidth: 2,
          borderColor: isFocused ? '#3b82f6' : 'transparent',
        };
      case 'outlined':
        backgroundColor = isDark ? '#1f2937' : '#ffffff';
        return {
          ...baseStyle,
          ...sizeStyles[size],
          backgroundColor,
          borderWidth: 1,
          borderColor,
        };
      default:
        backgroundColor = isDark ? '#1f2937' : '#ffffff';
        return {
          ...baseStyle,
          ...sizeStyles[size],
          backgroundColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        };
    }
  };

  const getInputStyle = (): TextStyle => {
    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    return {
      flex: 1,
      color: isDark ? '#f9fafb' : '#111827',
      ...sizeStyles[size],
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#d1d5db' : '#374151',
      marginBottom: 8,
    };
  };

  const getHelperTextStyle = (): TextStyle => {
    return {
      fontSize: 12,
      marginTop: 4,
      color: error ? '#ef4444' : isDark ? '#9ca3af' : '#6b7280',
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: '#ef4444' }}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: 12 }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: 12 }}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
