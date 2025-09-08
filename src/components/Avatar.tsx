import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  onPress?: () => void;
  showBadge?: boolean;
  badgeColor?: string;
  variant?: 'circle' | 'rounded' | 'square';
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  onPress,
  showBadge = false,
  badgeColor = '#10b981',
  variant = 'circle',
  backgroundColor,
  textColor,
  disabled = false,
}) => {
  const { isDark } = useTheme();

  const getSizeValue = (sizeType: string | number): number => {
    if (typeof sizeType === 'number') return sizeType;
    
    const sizes = {
      small: 32,
      medium: 48,
      large: 64,
      xlarge: 96,
    };
    return sizes[sizeType as keyof typeof sizes] || 48;
  };

  const sizeValue = getSizeValue(size);

  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getContainerStyle = (): ViewStyle => {
    const borderRadiusMap = {
      circle: sizeValue / 2,
      rounded: sizeValue * 0.2,
      square: 0,
    };

    return {
      width: sizeValue,
      height: sizeValue,
      borderRadius: borderRadiusMap[variant],
      backgroundColor: backgroundColor || (isDark ? '#374151' : '#f3f4f6'),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getImageStyle = (): ImageStyle => {
    return {
      width: sizeValue,
      height: sizeValue,
      borderRadius: variant === 'circle' ? sizeValue / 2 : variant === 'rounded' ? sizeValue * 0.2 : 0,
    };
  };

  const getTextStyle = (): TextStyle => {
    const fontSize = sizeValue * 0.4;
    return {
      fontSize,
      fontWeight: '600',
      color: textColor || (isDark ? '#f9fafb' : '#111827'),
    };
  };

  const getBadgeStyle = (): ViewStyle => {
    const badgeSize = sizeValue * 0.3;
    return {
      position: 'absolute',
      right: -2,
      top: -2,
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      backgroundColor: badgeColor,
      borderWidth: 2,
      borderColor: isDark ? '#1f2937' : '#ffffff',
    };
  };

  const renderContent = () => (
    <View style={getContainerStyle()}>
      {source ? (
        <Image source={source} style={getImageStyle()} />
      ) : name ? (
        <Text style={getTextStyle()}>{getInitials(name)}</Text>
      ) : (
        <View style={{ 
          width: sizeValue * 0.6, 
          height: sizeValue * 0.6, 
          backgroundColor: isDark ? '#6b7280' : '#d1d5db',
          borderRadius: sizeValue * 0.3,
        }} />
      )}
      
      {showBadge && <View style={getBadgeStyle()} />}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

export default Avatar;
