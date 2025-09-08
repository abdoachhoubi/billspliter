import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Input,
  Card,
  Avatar,
  ListItem,
  FAB,
  Badge,
  Chip,
  Divider,
  Switch,
  Checkbox,
  RadioButton,
  RadioGroup,
} from '../components';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ComponentsDemo: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  
  // State for interactive components
  const [inputValue, setInputValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('credit');
  const [selectedChips, setSelectedChips] = useState<string[]>(['chip1']);

  const handleChipPress = (chipId: string) => {
    setSelectedChips(prev => 
      prev.includes(chipId) 
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    );
  };

  const getBackgroundColor = () => ({
    backgroundColor: isDark ? '#111827' : '#f9fafb',
  });

  return (
    <View style={[styles.container, getBackgroundColor()]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.section}>
          <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]}>
            UI Components Demo
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#d1d5db' : '#6b7280' }]}>
            Showcase of reusable components
          </Text>
        </View>

        {/* Buttons */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Buttons
          </Text>
          <View style={styles.buttonRow}>
            <Button title="Primary" variant="primary" size="medium" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" size="medium" onPress={() => {}} />
            <Button title="Danger" variant="danger" size="medium" onPress={() => {}} />
          </View>
          <View style={styles.buttonRow}>
            <Button title="Small" variant="primary" size="small" onPress={() => {}} />
            <Button title="Medium" variant="primary" size="medium" onPress={() => {}} />
            <Button title="Large" variant="primary" size="large" onPress={() => {}} />
          </View>
          <Button title="Full Width" variant="primary" fullWidth onPress={() => {}} />
        </Card>

        {/* Inputs */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Inputs
          </Text>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={inputValue}
            onChangeText={setInputValue}
            helperText="We'll never share your email"
            variant="outlined"
          />
          <Input
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            variant="filled"
            required
          />
        </Card>

        {/* Avatars & Badges */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Avatars & Badges
          </Text>
          <View style={styles.avatarRow}>
            <Avatar name="John Doe" size="small" variant="circle" />
            <Avatar name="Jane Smith" size="medium" variant="circle" showBadge />
            <Avatar name="Bob Wilson" size="large" variant="rounded" />
            <Badge count={5} variant="error">
              <Avatar name="Alice Brown" size="medium" variant="circle" />
            </Badge>
          </View>
        </Card>

        {/* List Items */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            List Items
          </Text>
          <ListItem
            title="John Doe"
            subtitle="john@example.com"
            description="Owes $25.50 for dinner last night"
            leftElement={<Avatar name="John Doe" size="medium" />}
            rightElement={<Badge count={3} variant="primary" size="small" />}
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            title="Jane Smith"
            subtitle="jane@example.com" 
            description="Split 2 bills this month"
            leftElement={<Avatar name="Jane Smith" size="medium" showBadge />}
            onPress={() => {}}
          />
        </Card>

        {/* Chips */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Chips
          </Text>
          <View style={styles.chipRow}>
            <Chip
              label="Food"
              selected={selectedChips.includes('chip1')}
              onPress={() => handleChipPress('chip1')}
              variant="filled"
              color="primary"
            />
            <Chip
              label="Drinks"
              selected={selectedChips.includes('chip2')}
              onPress={() => handleChipPress('chip2')}
              variant="outlined"
              color="secondary"
            />
            <Chip
              label="Entertainment"
              selected={selectedChips.includes('chip3')}
              onPress={() => handleChipPress('chip3')}
              variant="ghost"
              color="success"
            />
          </View>
        </Card>

        {/* Form Controls */}
        <Card variant="elevated" margin="small">
          <Text style={[styles.sectionTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
            Form Controls
          </Text>
          
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
            label="Push Notifications"
            description="Get notified about new bills and payments"
          />
          
          <View style={{ marginVertical: 16 }}>
            <Checkbox
              checked={checkboxValue}
              onPress={() => setCheckboxValue(!checkboxValue)}
              label="I agree to the terms"
              description="By checking this, you accept our terms and conditions"
            />
          </View>

          <Text style={[styles.subSectionTitle, { color: isDark ? '#d1d5db' : '#6b7280' }]}>
            Payment Method
          </Text>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <RadioButton
              label="Credit Card"
              description="Pay with Visa, MasterCard, or Amex"
              value="credit"
            />
            <RadioButton
              label="PayPal"
              description="Pay with your PayPal account"
              value="paypal"
            />
            <RadioButton
              label="Bank Transfer"
              description="Direct bank account transfer"
              value="bank"
            />
          </RadioGroup>
        </Card>

        {/* Spacing for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        onPress={() => console.log('FAB pressed')}
        icon={<Text style={{ color: 'white', fontSize: 24 }}>+</Text>}
        label="Add Bill"
        variant="primary"
        position="bottom-right"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ComponentsDemo;
