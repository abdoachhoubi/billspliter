import React from 'react';
import { Switch as RNSwitch, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  trackColor?: { false?: string; true?: string };
  thumbColor?: string;
  style?: ViewStyle;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'medium',
  color,
  trackColor,
  thumbColor,
  style,
}) => {
  const { isDark } = useTheme();

  const getSwitchScale = () => {
    const scales = {
      small: 0.8,
      medium: 1,
      large: 1.2,
    };
    return scales[size];
  };

  const getDefaultTrackColor = () => {
    return trackColor || {
      false: isDark ? '#374151' : '#d1d5db',
      true: color || '#3b82f6',
    };
  };

  const getDefaultThumbColor = () => {
    if (thumbColor) return thumbColor;
    return '#ffffff';
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: description ? 4 : 0,
    };
  };

  const getDescriptionStyle = (): TextStyle => {
    return {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 20,
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
      marginRight: 16,
    };
  };

  const getSwitchContainerStyle = (): ViewStyle => {
    const scale = getSwitchScale();
    return {
      transform: [{ scale }],
    };
  };

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  if (label || description) {
    return (
      <TouchableOpacity
        style={getContainerStyle()}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
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
        
        <View style={getSwitchContainerStyle()}>
          <RNSwitch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={getDefaultTrackColor()}
            thumbColor={getDefaultThumbColor()}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getSwitchContainerStyle(), style]}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={getDefaultTrackColor()}
        thumbColor={getDefaultThumbColor()}
      />
    </View>
  );
};

export default Switch;
