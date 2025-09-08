import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  divider?: boolean;
  padding?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'card';
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  leftElement,
  rightElement,
  onPress,
  onLongPress,
  disabled = false,
  selected = false,
  divider = true,
  padding = 'medium',
  variant = 'default',
}) => {
  const { isDark } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const paddingStyles = {
      small: { paddingVertical: 8, paddingHorizontal: 12 },
      medium: { paddingVertical: 12, paddingHorizontal: 16 },
      large: { paddingVertical: 16, paddingHorizontal: 20 },
    };

    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      ...paddingStyles[padding],
    };

    if (variant === 'card') {
      baseStyle.backgroundColor = isDark ? '#1f2937' : '#ffffff';
      baseStyle.borderRadius = 8;
      baseStyle.marginVertical = 4;
      baseStyle.marginHorizontal = 16;
      baseStyle.shadowColor = '#000';
      baseStyle.shadowOffset = { width: 0, height: 1 };
      baseStyle.shadowOpacity = isDark ? 0.2 : 0.05;
      baseStyle.shadowRadius = 2;
      baseStyle.elevation = 1;
    } else {
      baseStyle.backgroundColor = selected 
        ? (isDark ? '#374151' : '#f3f4f6')
        : (isDark ? '#111827' : '#ffffff');
      
      if (divider) {
        baseStyle.borderBottomWidth = 1;
        baseStyle.borderBottomColor = isDark ? '#374151' : '#f3f4f6';
      }
    }

    return {
      ...baseStyle,
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getContentStyle = (): ViewStyle => {
    return {
      flex: 1,
      marginLeft: leftElement ? 12 : 0,
      marginRight: rightElement ? 12 : 0,
    };
  };

  const getTitleStyle = (): TextStyle => {
    return {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: subtitle || description ? 4 : 0,
    };
  };

  const getSubtitleStyle = (): TextStyle => {
    return {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#6b7280',
      marginBottom: description ? 2 : 0,
    };
  };

  const getDescriptionStyle = (): TextStyle => {
    return {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#9ca3af',
      lineHeight: 16,
    };
  };

  const renderContent = () => (
    <View style={getContainerStyle()}>
      {leftElement && (
        <View>
          {leftElement}
        </View>
      )}
      
      <View style={getContentStyle()}>
        <Text style={getTitleStyle()} numberOfLines={1}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={getSubtitleStyle()} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text style={getDescriptionStyle()} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      
      {rightElement && (
        <View>
          {rightElement}
        </View>
      )}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

export default ListItem;
