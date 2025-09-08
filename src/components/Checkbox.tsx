import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  style?: ViewStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  description,
  size = 'medium',
  color,
  disabled = false,
  indeterminate = false,
  style,
}) => {
  const { isDark } = useTheme();

  const getSizeStyles = () => {
    const sizes = {
      small: {
        checkboxSize: 16,
        fontSize: 14,
        iconSize: 10,
      },
      medium: {
        checkboxSize: 20,
        fontSize: 16,
        iconSize: 12,
      },
      large: {
        checkboxSize: 24,
        fontSize: 18,
        iconSize: 14,
      },
    };
    return sizes[size];
  };

  const sizeStyle = getSizeStyles();
  const activeColor = color || '#3b82f6';

  const getCheckboxStyle = (): ViewStyle => {
    return {
      width: sizeStyle.checkboxSize,
      height: sizeStyle.checkboxSize,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: (checked || indeterminate) 
        ? activeColor 
        : (isDark ? '#4b5563' : '#d1d5db'),
      backgroundColor: (checked || indeterminate) 
        ? activeColor 
        : (isDark ? '#1f2937' : '#ffffff'),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: label || description ? 12 : 0,
    };
  };

  const getIconStyle = (): TextStyle => {
    return {
      fontSize: sizeStyle.iconSize,
      color: '#ffffff',
      fontWeight: 'bold',
    };
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'flex-start',
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  };

  const getContentStyle = (): ViewStyle => {
    return {
      flex: 1,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: sizeStyle.fontSize,
      fontWeight: '500',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: description ? 4 : 0,
    };
  };

  const getDescriptionStyle = (): TextStyle => {
    return {
      fontSize: sizeStyle.fontSize - 2,
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: sizeStyle.fontSize + 2,
    };
  };

  const renderIcon = () => {
    if (indeterminate) {
      return <Text style={getIconStyle()}>–</Text>;
    }
    
    if (checked) {
      return <Text style={getIconStyle()}>✓</Text>;
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={getCheckboxStyle()}>
        {renderIcon()}
      </View>
      
      {(label || description) && (
        <View style={getContentStyle()}>
          {label && (
            <Text style={getLabelStyle()}>
              {label}
            </Text>
          )}
          
          {description && (
            <Text style={getDescriptionStyle()}>
              {description}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
