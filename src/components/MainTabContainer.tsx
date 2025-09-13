import BillsScreen from '@/screens/bills';
import HomeScreen from '@/screens/home';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ContactsScreen from '../screens/contacts';
import { CreateBillScreen } from '../screens/create-bill';
import { BottomTabNavigation, TabName } from './BottomTabNavigation';

interface MainTabContainerProps {
  onLanguageSettings?: () => void;
  onCreateBill?: () => void;
  onLogout?: () => void;
}

export const MainTabContainer: React.FC<MainTabContainerProps> = ({}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'createBill'>('main');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    setCurrentScreen('main'); // Always go back to main when changing tabs
  };

  const handleCreateBill = () => {
    setCurrentScreen('createBill');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  if (currentScreen === 'createBill') {
    return (
      <View style={styles.container}>
        <CreateBillScreen 
          navigation={{
            goBack: handleBackToMain,
            navigate: () => {},
          }}
        />
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onCreateBill={handleCreateBill} />;

      case 'bills':
        return <BillsScreen />;

      case 'contacts':
        return <ContactsScreen />;

      default:
        return <HomeScreen onCreateBill={handleCreateBill} />;
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
