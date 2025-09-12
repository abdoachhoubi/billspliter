import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  Global,
  Add,
  Clock,
  People,
  MoneyRecive,
} from 'iconsax-react-nativejs';
import { useSelector } from 'react-redux';

// Redux
import {
  selectAllBills,
  selectBillsStats,
} from '../store/selectors/billsSelectors';
import { Bill, BillUtils } from '../common/entities/bill.entity';

interface HomeScreenProps {
  onLanguageSettings?: () => void;
  onCreateBill?: () => void;
  onViewBills?: () => void;
  onViewBillDetail?: (bill: Bill) => void;
}

export default function HomeScreen({
  onLanguageSettings,
  onCreateBill,
  onViewBills,
  onViewBillDetail,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const bills = useSelector(selectAllBills);
  const billsStats = useSelector(selectBillsStats);

  const renderBillItem = ({ item: bill }: { item: Bill }) => (
    <TouchableOpacity
      style={styles.billCard}
      onPress={() => onViewBillDetail?.(bill)}
    >
      <View style={styles.billHeader}>
        <Text style={styles.billTitle}>{bill.title}</Text>
        <View style={[styles.statusBadge, getStatusBadgeStyle(bill.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(bill.status)]}>
            {bill.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.billAmount}>
        {BillUtils.formatAmount(bill.totalAmount)}
      </Text>

      <View style={styles.billDetails}>
        <View style={styles.billDetailItem}>
          <People size={16} color="#888888" />
          <Text style={styles.billDetailText}>
            {bill.participants.length + 1} participants
          </Text>
        </View>
        <View style={styles.billDetailItem}>
          <Clock size={16} color="#888888" />
          <Text style={styles.billDetailText}>
            {new Date(bill.creationDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {bill.description && (
        <Text style={styles.billDescription} numberOfLines={2}>
          {bill.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#FEF3C7' };
      case 'paid':
        return { backgroundColor: '#D1FAE5' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2' };
      default:
        return { backgroundColor: '#F3F4F6' };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: '#92400E' };
      case 'paid':
        return { color: '#065F46' };
      case 'cancelled':
        return { color: '#991B1B' };
      default:
        return { color: '#374151' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={onLanguageSettings}
        >
          <Global size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      {bills.length > 0 && (
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{billsStats.totalBills}</Text>
            <Text style={styles.statLabel}>Total Bills</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{billsStats.pendingBills}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${billsStats.totalAmount.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
        </View>
      )}

      {/* Bills List */}
      <View style={styles.billsSection}>
        <View style={styles.billsHeader}>
          <Text style={styles.sectionTitle}>Your Bills</Text>
          <View style={styles.headerButtons}>
            {bills.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewBills}
              >
                <Text style={styles.viewAllButtonText}>View All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateBill}
            >
              <Add size={20} color="#ffffff" />
              <Text style={styles.createButtonText}>Create Bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {bills.length === 0 ? (
          <View style={styles.emptyState}>
            <MoneyRecive size={48} color="#666666" />
            <Text style={styles.emptyTitle}>No Bills Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first bill to start splitting expenses
            </Text>
            <TouchableOpacity
              style={styles.emptyCreateButton}
              onPress={onCreateBill}
            >
              <Add size={20} color="#ffffff" />
              <Text style={styles.createButtonText}>Create Bill</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={bills.slice(0, 3)} // Show only first 3 bills on home screen
            renderItem={renderBillItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.billsList}
            ListFooterComponent={
              bills.length > 3 ? (
                <TouchableOpacity
                  style={styles.viewMoreButton}
                  onPress={onViewBills}
                >
                  <Text style={styles.viewMoreText}>
                    View {bills.length - 3} more bills
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  languageButton: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  billsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  billsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  viewAllButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  billsList: {
    paddingBottom: 20,
  },
  billCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  billTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  billAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  billDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  billDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billDetailText: {
    fontSize: 12,
    color: '#888888',
  },
  billDescription: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  emptyCreateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  viewMoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  viewMoreText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
