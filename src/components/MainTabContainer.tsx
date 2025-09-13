import BillsScreen from '@/screens/bills';
import HomeScreen from '@/screens/home';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import ContactsScreen from '../screens/contacts';
import { CreateBillScreen } from '../screens/create-bill';
import BillDetailScreen from '../screens/bill-detail';
import ContactDetailScreen from '../screens/contact-detail';
import LanguageSettingsScreen from '../screens/language-settings';
import { BottomTabNavigation, TabName } from './BottomTabNavigation';
import { Bill } from '../common/entities/bill.entity';
import { ContactWithStats } from '../common/entities/contact.entity';

interface MainTabContainerProps {
  onLanguageSettings?: () => void;
  onCreateBill?: () => void;
  onLogout?: () => void;
}

export const MainTabContainer: React.FC<MainTabContainerProps> = ({}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'createBill' | 'billDetail' | 'contactDetail' | 'languageSettings'>('main');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactWithStats | null>(null);

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    setCurrentScreen('main'); // Always go back to main when changing tabs
    setSelectedBill(null); // Clear selected bill when changing tabs
    setSelectedContact(null); // Clear selected contact when changing tabs
  };

  const handleCreateBill = () => {
    setCurrentScreen('createBill');
  };

  const handleViewBillDetail = (bill: Bill) => {
    setSelectedBill(bill);
    setCurrentScreen('billDetail');
  };

  const handleViewContactDetail = (contact: ContactWithStats) => {
    setSelectedContact(contact);
    setCurrentScreen('contactDetail');
  };

  const handleLanguageSettings = () => {
    setCurrentScreen('languageSettings');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setSelectedBill(null);
    setSelectedContact(null);
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

  if (currentScreen === 'billDetail' && selectedBill) {
    return (
      <View style={styles.container}>
        <BillDetailScreen 
          bill={selectedBill}
          navigation={{
            goBack: handleBackToMain,
            navigate: () => {},
          }}
        />
      </View>
    );
  }

  if (currentScreen === 'contactDetail' && selectedContact) {
    return (
      <View style={styles.container}>
        <ContactDetailScreen 
          contact={selectedContact}
          billRelationships={[]} // TODO: Calculate relationships
          bills={[]} // TODO: Get related bills
          onBack={handleBackToMain}
          onEditContact={() => {}} // TODO: Add edit functionality
          onToggleFavorite={() => {}} // TODO: Add toggle functionality
          onCallContact={() => {}} // TODO: Add call functionality
          onMessageContact={() => {}} // TODO: Add message functionality
          onViewBill={(billId: string) => {
            // TODO: Get bill by ID and call handleViewBillDetail
            console.log('View bill:', billId);
          }}
        />
      </View>
    );
  }

  if (currentScreen === 'languageSettings') {
    return (
      <View style={styles.container}>
        <LanguageSettingsScreen />
        {/* Add a back button overlay */}
        <TouchableOpacity
          style={styles.backButtonOverlay}
          onPress={handleBackToMain}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            onCreateBill={handleCreateBill}
            onViewBillDetail={handleViewBillDetail}
            onLanguageSettings={handleLanguageSettings}
          />
        );

      case 'bills':
        return (
          <BillsScreen 
            onCreateBill={handleCreateBill}
            onViewBillDetail={handleViewBillDetail}
          />
        );

      case 'contacts':
        return (
          <ContactsScreen 
            onViewContactDetail={handleViewContactDetail}
          />
        );

      default:
        return (
          <HomeScreen 
            onCreateBill={handleCreateBill}
            onViewBillDetail={handleViewBillDetail}
            onLanguageSettings={handleLanguageSettings}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Only show bottom navigation on main screens */}
      {currentScreen === 'main' && (
        <BottomTabNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      )}
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
  backButtonOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
