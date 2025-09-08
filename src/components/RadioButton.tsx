import React from 'react';
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface RadioButtonProps {
  selected?: boolean;
  onPress?: () => void;
  label?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
  value?: string;
  style?: ViewStyle;
}

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactElement<RadioButtonProps>[];
  disabled?: boolean;
  style?: ViewStyle;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  selected = false,
  onPress,
  label,
  description,
  size = 'medium',
  color,
  disabled = false,
  value,
  style,
}) => {
  const { isDark } = useTheme();

  const getSizeStyles = () => {
    const sizes = {
      small: {
        radioSize: 16,
        innerSize: 8,
        fontSize: 14,
      },
      medium: {
        radioSize: 20,
        innerSize: 10,
        fontSize: 16,
      },
      large: {
        radioSize: 24,
        innerSize: 12,
        fontSize: 18,
      },
    };
    return sizes[size];
  };

  const sizeStyle = getSizeStyles();
  const activeColor = color || '#3b82f6';

  const getRadioStyle = (): ViewStyle => {
    return {
      width: sizeStyle.radioSize,
      height: sizeStyle.radioSize,
      borderRadius: sizeStyle.radioSize / 2,
      borderWidth: 2,
      borderColor: selected 
        ? activeColor 
        : (isDark ? '#4b5563' : '#d1d5db'),
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: label || description ? 12 : 0,
    };
  };

  const getInnerCircleStyle = (): ViewStyle => {
    return {
      width: sizeStyle.innerSize,
      height: sizeStyle.innerSize,
      borderRadius: sizeStyle.innerSize / 2,
      backgroundColor: activeColor,
      opacity: selected ? 1 : 0,
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

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress || (() => {})}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <View style={getRadioStyle()}>
        <View style={getInnerCircleStyle()} />
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

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  disabled = false,
  style,
}) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const radioValue = child.props.value || index.toString();
          return React.cloneElement(child, {
            ...child.props,
            selected: value === radioValue,
            onPress: () => !disabled && onValueChange(radioValue),
            disabled: disabled || child.props.disabled,
          });
        }
        return child;
      })}
    </View>
  );
};

export { RadioButton, RadioGroup };
export default RadioButton;
