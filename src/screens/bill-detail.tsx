import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  Clock,
  TrendingUp,
  PieChart,
  Share,
  Download,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { AppDispatch } from '../store';
import { deleteBillById, updateBillStatusById } from '../store/thunks/billsThunks';
import { selectBillById } from '../store/selectors/billsSelectors';

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

interface BillDetailScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  route?: {
    params: {
      bill: Bill;
    };
  };
  bill?: Bill; // Fallback for when route is not available
  billId?: string; // Alternative way to pass bill ID
}

export default function BillDetailScreen({ navigation, route, bill: propBill, billId }: BillDetailScreenProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get bill ID from various sources
  const currentBillId = billId || route?.params?.bill?.id || propBill?.id;
  
  // Subscribe to Redux state for real-time updates
  const billFromStore = useSelector((state: any) => 
    currentBillId ? selectBillById(state, currentBillId) : null
  );
  
  // Always prefer the bill from Redux store for real-time updates
  const bill = billFromStore || route?.params?.bill || propBill;
  
  const [showActionsModal, setShowActionsModal] = useState(false);
  
  // Debug logging to track state changes
  React.useEffect(() => {
    console.log('Bill Detail Debug:');
    console.log('currentBillId:', currentBillId);
    console.log('billFromStore status:', billFromStore?.status);
    console.log('bill status:', bill?.status);
    console.log('showActionsModal:', showActionsModal);
  }, [currentBillId, billFromStore?.status, bill?.status, showActionsModal]);
  
  // Track previous status to detect actual changes
  const prevStatusRef = React.useRef(billFromStore?.status);
  
  // Close modal only when bill status actually changes (not just when it exists)
  React.useEffect(() => {
    const currentStatus = billFromStore?.status;
    const previousStatus = prevStatusRef.current;
    
    if (currentStatus && previousStatus && currentStatus !== previousStatus) {
      console.log('Bill status changed from', previousStatus, 'to', currentStatus);
      // Force modal to close when status changes
      if (showActionsModal) {
        console.log('Closing modal due to status change');
        setShowActionsModal(false);
      }
    }
    
    // Update the ref for next comparison
    prevStatusRef.current = currentStatus;
  }, [billFromStore?.status, showActionsModal]);

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Bill not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteBill = () => {
    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteBillById(bill.id));
            navigation?.goBack();
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = async () => {
    console.log('Marking bill as paid:', bill.id);
    setShowActionsModal(false); // Close modal immediately
    try {
      await dispatch(updateBillStatusById({ billId: bill.id, status: 'paid' })).unwrap();
      console.log('Bill status updated successfully to paid');
    } catch (error) {
      console.error('Failed to update bill status:', error);
      Alert.alert('Error', 'Failed to update bill status. Please try again.');
    }
  };

  const handleMarkAsPending = async () => {
    console.log('Marking bill as pending:', bill.id);
    setShowActionsModal(false); // Close modal immediately
    try {
      await dispatch(updateBillStatusById({ billId: bill.id, status: 'pending' })).unwrap();
      console.log('Bill status updated successfully to pending');
    } catch (error) {
      console.error('Failed to update bill status:', error);
      Alert.alert('Error', 'Failed to update bill status. Please try again.');
    }
  };

  const handleCancelBill = () => {
    Alert.alert(
      'Cancel Bill',
      'Are you sure you want to cancel this bill?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setShowActionsModal(false); // Close modal immediately
            try {
              await dispatch(updateBillStatusById({ billId: bill.id, status: 'cancelled' })).unwrap();
              console.log('Bill cancelled successfully');
            } catch (error) {
              console.error('Failed to cancel bill:', error);
              Alert.alert('Error', 'Failed to cancel bill. Please try again.');
            }
          },
        },
      ]
    );
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
        return COLORS.textSecondary;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FEF3C7';
      case 'paid':
        return '#D1FAE5';
      case 'cancelled':
        return '#FEE2E2';
      default:
        return COLORS.cardBackground;
    }
  };

  const ownerShare = bill.totalAmount - bill.participants.reduce((sum, p) => sum + p.splitValue, 0);
  const totalParticipants = bill.participants.length + 1; // +1 for owner

  const renderParticipant = (participant: any, index: number) => (
    <View key={participant.user.id} style={styles.participantCard}>
      <View style={styles.participantHeader}>
        <View style={styles.participantAvatar}>
          <Text style={styles.participantInitials}>
            {participant.user.firstName.charAt(0)}{participant.user.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>
            {participant.user.firstName} {participant.user.lastName}
          </Text>
          <Text style={styles.participantEmail}>{participant.user.email}</Text>
        </View>
        <View style={styles.participantAmount}>
          <Text style={styles.amountText}>
            {BillUtils.formatAmount(participant.amountToPay)}
          </Text>
          <Text style={styles.percentageText}>
            {((participant.amountToPay / bill.totalAmount) * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOwnerCard = () => (
    <View style={[styles.participantCard, styles.ownerCard]}>
      <View style={styles.participantHeader}>
        <View style={[styles.participantAvatar, styles.ownerAvatar]}>
          <Text style={styles.participantInitials}>
            {bill.owner.user.firstName.charAt(0)}{bill.owner.user.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>
            {bill.owner.user.firstName} {bill.owner.user.lastName}
          </Text>
          <Text style={styles.participantEmail}>{bill.owner.user.email}</Text>
          <View style={styles.ownerBadge}>
            <Text style={styles.ownerBadgeText}>OWNER</Text>
          </View>
        </View>
        <View style={styles.participantAmount}>
          <Text style={styles.amountText}>
            {BillUtils.formatAmount(bill.owner.amountToPay)}
          </Text>
          <Text style={styles.percentageText}>
            {((bill.owner.amountToPay / bill.totalAmount) * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );

  const ActionsModal = () => (
    <Modal
      visible={showActionsModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowActionsModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Bill Actions</Text>
          <TouchableOpacity onPress={() => setShowActionsModal(false)}>
            <XCircle size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          {bill.status !== 'paid' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleMarkAsPaid}>
              <CheckCircle size={24} color="#10B981" />
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          )}

          {bill.status === 'paid' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleMarkAsPending}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.actionButtonText}>Mark as Pending</Text>
            </TouchableOpacity>
          )}

          {bill.status !== 'cancelled' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCancelBill}>
              <XCircle size={24} color="#EF4444" />
              <Text style={styles.actionButtonText}>Cancel Bill</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton}>
            <Share size={24} color={COLORS.premium} />
            <Text style={styles.actionButtonText}>Share Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Download size={24} color={COLORS.premium} />
            <Text style={styles.actionButtonText}>Export PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.destructiveAction]} 
            onPress={handleDeleteBill}
          >
            <Trash2 size={24} color="#EF4444" />
            <Text style={[styles.actionButtonText, styles.destructiveText]}>Delete Bill</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation?.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowActionsModal(true)}
        >
          <MoreVertical size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bill Header */}
        <View style={styles.billHeader}>
          <View style={styles.billTitleContainer}>
            <Text style={styles.billTitle}>{bill.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(bill.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                {bill.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          {bill.description && (
            <Text style={styles.billDescription}>{bill.description}</Text>
          )}
          
          <View style={styles.billMeta}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                Created {new Date(bill.creationDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Total Amount */}
        <View style={styles.totalAmountContainer}>
          <View style={styles.totalAmountCard}>
            <DollarSign size={32} color={COLORS.premium} />
            <View style={styles.totalAmountInfo}>
              <Text style={styles.totalAmountLabel}>Total Amount</Text>
              <Text style={styles.totalAmountValue}>
                {BillUtils.formatAmount(bill.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <PieChart size={24} color={COLORS.premium} />
            <Text style={styles.statValue}>
              {BillUtils.formatAmount(bill.totalAmount / totalParticipants)}
            </Text>
            <Text style={styles.statLabel}>Avg per person</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color={COLORS.premium} />
            <Text style={styles.statValue}>
              {BillUtils.formatAmount(Math.max(...bill.participants.map(p => p.amountToPay), bill.owner.amountToPay))}
            </Text>
            <Text style={styles.statLabel}>Highest share</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color={COLORS.premium} />
            <Text style={styles.statValue}>{totalParticipants}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
        </View>

        {/* Split Type Information */}
        <View style={styles.splitTypeContainer}>
          <Text style={styles.sectionTitle}>Split Details</Text>
          <View style={styles.splitTypeCard}>
            <Text style={styles.splitTypeLabel}>Split Method</Text>
            <Text style={styles.splitTypeValue}>
              {bill.splitType === 'amount' ? 'Fixed Amount' : 'Percentage'}
            </Text>
          </View>
        </View>

        {/* Participants List */}
        <View style={styles.participantsContainer}>
          <Text style={styles.sectionTitle}>Participants</Text>
          
          {/* Owner */}
          {renderOwnerCard()}
          
          {/* Other Participants */}
          {bill.participants.map((participant, index) => renderParticipant(participant, index))}
        </View>
      </ScrollView>

      <ActionsModal />
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
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  billHeader: {
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    marginBottom: SPACING.md,
  },
  billTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  billTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginRight: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  billDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  billMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  totalAmountContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  totalAmountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.premium,
  },
  totalAmountInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  totalAmountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  totalAmountValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  splitTypeContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  splitTypeCard: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitTypeLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  splitTypeValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  participantsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  participantCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ownerCard: {
    borderColor: COLORS.premium,
    borderWidth: 2,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.premium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  ownerAvatar: {
    backgroundColor: COLORS.premium,
  },
  participantInitials: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  participantEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  ownerBadge: {
    backgroundColor: COLORS.premium,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  ownerBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  participantAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.premium,
  },
  percentageText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  destructiveAction: {
    backgroundColor: '#FEE2E2',
  },
  destructiveText: {
    color: '#EF4444',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.premium,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.background,
  },
});
