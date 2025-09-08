import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  length?: number | string;
  color?: string;
  margin?: number;
  text?: string;
  textPosition?: 'left' | 'center' | 'right';
  style?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  length = '100%',
  color,
  margin = 0,
  text,
  textPosition = 'center',
  style,
}) => {
  const { isDark } = useTheme();

  const defaultColor = color || (isDark ? '#374151' : '#e5e7eb');

  const getLineStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: variant === 'solid' ? defaultColor : 'transparent',
    };

    if (orientation === 'horizontal') {
      baseStyle.width = length as any;
      baseStyle.height = thickness;
      baseStyle.marginVertical = margin;
      
      if (variant === 'dashed') {
        baseStyle.borderTopWidth = thickness;
        baseStyle.borderTopColor = defaultColor;
        baseStyle.borderStyle = 'dashed';
        baseStyle.backgroundColor = 'transparent';
      } else if (variant === 'dotted') {
        baseStyle.borderTopWidth = thickness;
        baseStyle.borderTopColor = defaultColor;
        baseStyle.borderStyle = 'dotted';
        baseStyle.backgroundColor = 'transparent';
      }
    } else {
      baseStyle.height = length as any;
      baseStyle.width = thickness;
      baseStyle.marginHorizontal = margin;
      
      if (variant === 'dashed') {
        baseStyle.borderLeftWidth = thickness;
        baseStyle.borderLeftColor = defaultColor;
        baseStyle.borderStyle = 'dashed';
        baseStyle.backgroundColor = 'transparent';
      } else if (variant === 'dotted') {
        baseStyle.borderLeftWidth = thickness;
        baseStyle.borderLeftColor = defaultColor;
        baseStyle.borderStyle = 'dotted';
        baseStyle.backgroundColor = 'transparent';
      }
    }

    return {
      ...baseStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    return {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      paddingHorizontal: 16,
      backgroundColor: isDark ? '#111827' : '#ffffff',
    };
  };

  const getContainerStyle = (): ViewStyle => {
    if (orientation === 'horizontal') {
      return {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      };
    } else {
      return {
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      };
    }
  };

  if (text && orientation === 'horizontal') {
    const justifyContent = 
      textPosition === 'left' ? 'flex-start' :
      textPosition === 'right' ? 'flex-end' : 'center';

    return (
      <View style={[getContainerStyle(), { justifyContent }]}>
        {textPosition === 'center' && <View style={[getLineStyle(), { flex: 1 }]} />}
        <Text style={getTextStyle()}>{text}</Text>
        <View style={[getLineStyle(), { flex: 1 }]} />
      </View>
    );
  }

  if (text && orientation === 'vertical') {
    const justifyContent = 
      textPosition === 'left' ? 'flex-start' :
      textPosition === 'right' ? 'flex-end' : 'center';

    return (
      <View style={[getContainerStyle(), { justifyContent }]}>
        {textPosition === 'center' && <View style={[getLineStyle(), { flex: 1 }]} />}
        <Text style={[getTextStyle(), { 
          paddingHorizontal: 0, 
          paddingVertical: 16,
          transform: [{ rotate: '90deg' }]
        }]}>
          {text}
        </Text>
        <View style={[getLineStyle(), { flex: 1 }]} />
      </View>
    );
  }

  return <View style={getLineStyle()} />;
};

export default Divider;
