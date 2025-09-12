import { FileText, Home, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4; // Account for left/right margins (16*2) + padding (16*2)

export type TabName = 'home' | 'bills' | 'contacts' | 'profile';

interface BottomTabNavigationProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

interface Tab {
  id: TabName;
  icon: React.ReactNode;
  name: string;
}

const TabItem = ({
  tab,
  isActive,
  switchTab,
}: {
  tab: Tab;
  isActive: boolean;
  switchTab: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        {
          backgroundColor: isActive ? '#fb5700' : 'transparent',
        },
      ]}
      onPress={switchTab}
    >
      {tab.icon}
      {isActive && <Text style={styles.tabItemText}>{tab.name}</Text>}
    </TouchableOpacity>
  );
};

const BottomNavigation = ({
  activeTab,
  onTabPress,
}: BottomTabNavigationProps) => {
  const { t } = useTranslation('common.navigation');

  const [currentTab, setCurrentTab] = useState<TabName>(activeTab);

  const tabs: Tab[] = [
    {
      id: 'home',
      icon: <Home color={currentTab === 'home' ? '#FFFFFF' : '#000000'} />,
      name: t('home'),
    },
    {
      id: 'bills',
      icon: <FileText color={currentTab === 'bills' ? '#FFFFFF' : '#000000'} />,
      name: t('bills'),
    },
    {
      id: 'contacts',
      icon: <Users color={currentTab === 'contacts' ? '#FFFFFF' : '#000000'} />,
      name: t('contacts'),
    },
    {
      id: 'profile',
      icon: <User color={currentTab === 'profile' ? '#FFFFFF' : '#000000'} />,
      name: t('profile'),
    },
  ];

  const switchTab = (tab: TabName) => {
    setCurrentTab(tab);
    onTabPress(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        {tabs.map(tab => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={currentTab === tab.id}
            switchTab={() => switchTab(tab.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  tab: {
    flex: 0,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabItem: {
    borderRadius: 200,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export { BottomNavigation as BottomTabNavigation };
