import { CreateBillScreen } from '@/screens/create-bill';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import BillDetailScreen from './src/screens/bill-detail';
import BillsScreen from './src/screens/bills';
import HomeScreen from './src/screens/home';
import LanguageSettingsScreen from './src/screens/language-settings';
import OnboardingScreen from './src/screens/onboarding';
import { MainTabContainer } from './src/components';
import { persistor, store } from './src/store';

function AppContent() {
  const { t } = useTranslation();
  const { currentLanguage, isCurrentRTL } = useLanguage();
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    'onboarding' | 'main' | 'createBill' | 'bills' | 'billDetail'
  >('main'); // Start with main tab container
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('main');
  };

  const handleLanguageSettings = () => {
    setShowLanguageSettings(true);
  };

  const handleCreateBill = () => {
    setCurrentScreen('createBill');
  };

  const handleViewBills = () => {
    setCurrentScreen('bills');
  };

  const handleViewBillDetail = (bill: any) => {
    setSelectedBillId(bill.id);
    setCurrentScreen('billDetail');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  if (showLanguageSettings) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, isCurrentRTL && styles.backButtonRTL]}
          onPress={() => setShowLanguageSettings(false)}
        >
          {isCurrentRTL ? (
            <View style={styles.rtlBackButton}>
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
              <ChevronRight size={20} color="#ffffff" />
            </View>
          ) : (
            <View style={styles.ltrBackButton}>
              <ChevronLeft size={20} color="#ffffff" />
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </View>
          )}
        </TouchableOpacity>
        <LanguageSettingsScreen />
      </View>
    );
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'main') {
    return (
      <MainTabContainer
        onLanguageSettings={handleLanguageSettings}
        onCreateBill={handleCreateBill}
      />
    );
  }

  if (currentScreen === 'createBill') {
    return (
      <CreateBillScreen
        navigation={{
          navigate: () => {},
          goBack: handleBackToMain,
        }}
      />
    );
  }

  if (currentScreen === 'bills') {
    return (
      <BillsScreen
        navigation={{
          goBack: handleBackToMain,
          navigate: (screen: string, params?: any) => {
            if (screen === 'BillDetail' && params?.bill) {
              handleViewBillDetail(params.bill);
            }
          },
        }}
        onCreateBill={handleCreateBill}
      />
    );
  }

  if (currentScreen === 'billDetail') {
    return (
      <BillDetailScreen
        billId={selectedBillId || undefined}
        navigation={{
          goBack: () => setCurrentScreen('bills'),
          navigate: () => {},
        }}
      />
    );
  }

  return null;
}

export default function App() {
	 const [showLanguageSettings, setShowLanguageSettings] = useState(false);
 const handleLanguageSettings = () => {
    setShowLanguageSettings(true);
  };
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          }
          persistor={persistor}
        >
          <LanguageProvider>
            <MainTabContainer
        onLanguageSettings={handleLanguageSettings}
      />
          </LanguageProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#888888',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  hello: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#888888',
    marginBottom: 30,
    textAlign: 'center',
  },
  languageInfo: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLangLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 5,
  },
  currentLang: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  languageButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
  },
  backButtonRTL: {
    alignItems: 'flex-end',
  },
  rtlBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ltrBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
