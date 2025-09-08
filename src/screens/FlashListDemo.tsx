import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { ListItem, Avatar } from '../components';
import { useTheme } from '../context/ThemeContext';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  participants: string[];
  category: string;
}

const FlashListDemo: React.FC = () => {
  const { isDark } = useTheme();

  // Generate mock data for demonstration
  const generateTransactions = (): Transaction[] => {
    const descriptions = [
      'Dinner at Italian Restaurant',
      'Coffee Shop',
      'Movie Tickets',
      'Grocery Shopping',
      'Uber Ride',
      'Gas Station',
      'Pharmacy',
      'Book Store',
      'Music Concert',
      'Hotel Stay',
    ];
    
    const participants = [
      ['Alice', 'Bob'],
      ['Charlie', 'David', 'Eve'],
      ['Frank', 'Grace'],
      ['Henry', 'Ivy', 'Jack', 'Kate'],
      ['Liam', 'Maya'],
    ];
    
    const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health'];
    
    return Array.from({ length: 1000 }, (_, index) => ({
      id: `transaction_${index}`,
      description: descriptions[index % descriptions.length],
      amount: Math.floor(Math.random() * 200) + 10,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toDateString(),
      participants: participants[index % participants.length],
      category: categories[index % categories.length],
    }));
  };

  const transactions = generateTransactions();

  const renderTransaction = ({ item }: { item: Transaction }) => {
    return (
      <ListItem
        title={item.description}
        subtitle={`${item.participants.join(', ')} • ${item.date}`}
        rightElement={
          <Text style={{ fontWeight: 'bold', color: '#059669' }}>
            ${item.amount.toFixed(2)}
          </Text>
        }
        leftElement={
          <Avatar
            name={item.category}
            size="medium"
          />
        }
        onPress={() => console.log('Transaction pressed:', item.id)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
          FlashList Demo
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#d1d5db' : '#6b7280' }]}>
          {transactions.length} transactions rendered with FlashList
        </Text>
      </View>
      
      <FlashList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default FlashListDemo;
