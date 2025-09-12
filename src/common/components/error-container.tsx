import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorContainerProps {
  message: string;
  style?: any;
}

export default function ErrorContainer({
  message,
  style,
}: ErrorContainerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});
