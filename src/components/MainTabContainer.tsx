import BillsScreen from '@/screens/bills';
import HomeScreen from '@/screens/home';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ContactsScreen from '../screens/contacts';
import { BottomTabNavigation, TabName } from './BottomTabNavigation';

interface MainTabContainerProps {
  onLanguageSettings?: () => void;
  onCreateBill?: () => void;
  onLogout?: () => void;
}

export const MainTabContainer: React.FC<MainTabContainerProps> = ({}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;

      case 'bills':
        return <BillsScreen />;

      case 'contacts':
        return <ContactsScreen />;

      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      <BottomTabNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingBottom: 0, // Space for the bottom navigation
  },
});
