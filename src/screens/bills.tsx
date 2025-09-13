import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  DollarSign,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Settings,
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { RootState, AppDispatch } from '../store';
import {
  selectAllBills,
  selectBillsStats,
  selectBillsByStatus,
  selectBillsSortedByDate,
  selectBillsSortedByAmount,
  selectBillsBySearch,
} from '../store/selectors/billsSelectors';
import {
  deleteBillById,
  updateBillStatusById,
} from '../store/thunks/billsThunks';

// Theme
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../common/constants/theme';

// Types
import { Bill, BillUtils } from '../common/entities/bill.entity';

// Components
import SearchInput from '../common/components/search-input';

interface BillsScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  onCreateBill?: () => void;
  onViewBillDetail?: (bill: Bill) => void;
  onLanguageSettings?: () => void;
}

type FilterType = 'all' | 'pending' | 'paid' | 'cancelled';
type SortType = 'date' | 'amount' | 'title';

export default function BillsScreen({
  navigation,
  onCreateBill,
  onViewBillDetail,
  onLanguageSettings,
}: BillsScreenProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillActions, setShowBillActions] = useState(false);

  // Redux selectors
  const allBills = useSelector(selectAllBills);
  const billsStats = useSelector(selectBillsStats);
  const pendingBills = useSelector((state: RootState) =>
    selectBillsByStatus(state, 'pending')
  );
  const paidBills = useSelector((state: RootState) =>
    selectBillsByStatus(state, 'paid')
  );
  const cancelledBills = useSelector((state: RootState) =>
    selectBillsByStatus(state, 'cancelled')
  );
  const billsSortedByDate = useSelector(selectBillsSortedByDate);
  const billsSortedByAmount = useSelector(selectBillsSortedByAmount);

  // Filtered and sorted bills
  const filteredAndSortedBills = useMemo(() => {
    let bills: Bill[] = [];

    // Apply filter
    switch (filterType) {
      case 'pending':
        bills = pendingBills;
        break;
      case 'paid':
        bills = paidBills;
        break;
      case 'cancelled':
        bills = cancelledBills;
        break;
      default:
        bills = allBills;
    }

    // Apply search
    if (searchQuery.trim()) {
      bills = bills.filter(
        bill =>
          bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (bill.description &&
            bill.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sort
    switch (sortType) {
      case 'amount':
        bills = [...bills].sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'title':
        bills = [...bills].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // date
        bills = [...bills].sort(
          (a, b) =>
            new Date(b.creationDate).getTime() -
            new Date(a.creationDate).getTime()
        );
    }

    return bills;
  }, [
    allBills,
    pendingBills,
    paidBills,
    cancelledBills,
    filterType,
    searchQuery,
    sortType,
  ]);

  const handleDeleteBill = async (billId: string) => {
    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteBillById(billId)).unwrap();
              setShowBillActions(false);
              setSelectedBill(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bill');
            }
          },
        },
      ]
    );
  };

  const handleUpdateBillStatus = async (
    billId: string,
    status: 'pending' | 'paid' | 'cancelled'
  ) => {
    try {
      await dispatch(updateBillStatusById({ billId, status })).unwrap();
      setShowBillActions(false);
      setSelectedBill(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update bill status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'paid':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'paid':
        return <CheckCircle size={16} color="#10B981" />;
      case 'cancelled':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const renderBillItem = ({ item: bill }: { item: Bill }) => (
    <TouchableOpacity
      style={styles.billCard}
      onPress={() => onViewBillDetail?.(bill) || navigation?.navigate?.('BillDetail', { bill })}
    >
      <View style={styles.billHeader}>
        <View style={styles.billTitleContainer}>
          <Text style={styles.billTitle} numberOfLines={1}>
            {bill.title}
          </Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(bill.status)}
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(bill.status) },
              ]}
            >
              {bill.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={e => {
            e.stopPropagation();
            setSelectedBill(bill);
            setShowBillActions(true);
          }}
        >
          <MoreVertical size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.billAmount}>
        {BillUtils.formatAmount(bill.totalAmount)}
      </Text>

      <View style={styles.billDetails}>
        <View style={styles.billDetailItem}>
          <Users size={14} color={COLORS.textSecondary} />
          <Text style={styles.billDetailText}>
            {bill.participants.length + 1} participants
          </Text>
        </View>
        <View style={styles.billDetailItem}>
          <Calendar size={14} color={COLORS.textSecondary} />
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

      <View style={styles.billFooter}>
        <Text style={styles.ownerText}>
          Created by {BillUtils.getParticipantDisplayName(bill.owner)}
        </Text>
        <Text style={styles.splitTypeText}>Split by {bill.splitType}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = (
    label: string,
    value: FilterType,
    count?: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        filterType === value && styles.filterChipActive,
      ]}
      onPress={() => setFilterType(value)}
    >
      <Text
        style={[
          styles.filterChipText,
          filterType === value && styles.filterChipTextActive,
        ]}
      >
        {label} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <DollarSign size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>
        {filterType === 'all' ? 'No Bills Yet' : `No ${filterType} Bills`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filterType === 'all'
          ? 'Create your first bill to start splitting expenses'
          : `You don't have any ${filterType} bills at the moment`}
      </Text>
      {filterType === 'all' && (
        <TouchableOpacity
          style={styles.emptyCreateButton}
          onPress={onCreateBill}
        >
          <Plus size={20} color={COLORS.background} />
          <Text style={styles.emptyCreateButtonText}>
            Create Your First Bill
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {navigation?.goBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Bills</Text>
        </View>
        <View style={styles.headerRight}>
          {onLanguageSettings && (
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={onLanguageSettings}
            >
              <Settings size={20} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.createButton} onPress={onCreateBill}>
            <Plus size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      {allBills.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{billsStats.totalBills}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{billsStats.pendingBills}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{billsStats.paidBills}</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${billsStats.totalAmount.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
        </View>
      )}

      {/* Search and Filters */}
      {allBills.length > 0 && (
        <View style={styles.controlsContainer}>
          <View style={styles.searchInputContainer}>
            <SearchInput
              placeholder="Search bills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInputStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Chips */}
      {allBills.length > 0 && (
        <View style={styles.filterChipsContainer}>
          {renderFilterChip('All', 'all', billsStats.totalBills)}
          {renderFilterChip('Pending', 'pending', billsStats.pendingBills)}
          {renderFilterChip('Paid', 'paid', billsStats.paidBills)}
          {renderFilterChip(
            'Cancelled',
            'cancelled',
            billsStats.cancelledBills
          )}
        </View>
      )}

      {/* Bills List */}
      <View style={styles.listContainer}>
        {filteredAndSortedBills.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredAndSortedBills}
            renderItem={renderBillItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>

            {(['date', 'amount', 'title'] as SortType[]).map(sort => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.modalOption,
                  sortType === sort && styles.modalOptionActive,
                ]}
                onPress={() => {
                  setSortType(sort);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    sortType === sort && styles.modalOptionTextActive,
                  ]}
                >
                  {sort === 'date'
                    ? 'Date Created'
                    : sort === 'amount'
                      ? 'Amount'
                      : 'Title'}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bill Actions Modal */}
      <Modal
        visible={showBillActions}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBillActions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBill?.title}</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateBillStatus(selectedBill!.id, 'paid')}
              disabled={selectedBill?.status === 'paid'}
            >
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                handleUpdateBillStatus(selectedBill!.id, 'pending')
              }
              disabled={selectedBill?.status === 'pending'}
            >
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.actionButtonText}>Mark as Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                handleUpdateBillStatus(selectedBill!.id, 'cancelled')
              }
              disabled={selectedBill?.status === 'cancelled'}
            >
              <XCircle size={20} color="#EF4444" />
              <Text style={styles.actionButtonText}>Cancel Bill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteBill(selectedBill!.id)}
            >
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete Bill
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowBillActions(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  createButton: {
    backgroundColor: COLORS.premium,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  settingsButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInputStyle: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    margin: 0,
  },
  filterButton: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.premium,
    borderColor: COLORS.premium,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterChipTextActive: {
    color: COLORS.background,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  billCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  billTitleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  billTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  billAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  billDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  billDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  billDetailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  billDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  billFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ownerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  splitTypeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  emptyCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.premium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.sm,
  },
  emptyCreateButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  modalOptionActive: {
    backgroundColor: COLORS.premium,
  },
  modalOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  modalOptionTextActive: {
    color: COLORS.background,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  modalCloseButton: {
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  modalCloseText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium,
  },
});
