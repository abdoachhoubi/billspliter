import React from 'react';
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function CustomInput({ 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  style,
  multiline = false,
  numberOfLines = 1
}: CustomInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#888888"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 17,
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    fontWeight: '500',
  },
});
