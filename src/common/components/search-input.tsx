import React from 'react';
import { TextInput, StyleSheet, TextStyle } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: TextStyle;
}

export default function SearchInput({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  containerStyle
}: SearchInputProps) {
  return (
    <TextInput
      style={[styles.searchInput, containerStyle]}
      placeholder={placeholder}
      placeholderTextColor="#888888"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 17,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 0,
    color: '#ffffff',
    fontWeight: '500',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
