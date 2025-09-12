import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}

export default function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
});
