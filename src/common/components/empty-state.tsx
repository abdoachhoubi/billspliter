import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message: string;
  style?: any;
}

export default function EmptyState({ message, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
});
