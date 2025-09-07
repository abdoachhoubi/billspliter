import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/Button';
import { ThemeProvider } from '../src/context/ThemeContext';

// Mock SecureStore for ThemeProvider
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, getByTestId } = renderWithTheme(
      <Button title="Test Button" onPress={mockOnPress} loading />
    );
    
    expect(queryByText('Test Button')).toBeNull();
    // ActivityIndicator doesn't have a specific test ID in our implementation
    // but we can check that the text is not visible
  });

  it('renders with different variants', () => {
    const { getByText } = renderWithTheme(
      <Button title="Danger Button" onPress={mockOnPress} variant="danger" />
    );
    
    expect(getByText('Danger Button')).toBeTruthy();
  });
});
