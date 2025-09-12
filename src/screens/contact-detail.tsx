import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Star1,
  Receipt,
  TrendUp,
  TrendDown,
  Calendar,
  User,
  Sms,
  Call,
  Edit,
  More,
} from 'iconsax-react-nativejs';
import { ContactWithStats } from '../common/entities/contact.entity';
import { Bill } from '../common/entities/bill.entity';
import { ContactBillRelationship } from '../common/utils/contact-bill-utils';

interface ContactDetailScreenProps {
  contact: ContactWithStats;
  billRelationships: ContactBillRelationship[];
  bills: Bill[];
  onBack: () => void;
  onEditContact: () => void;
  onToggleFavorite: () => void;
  onCallContact: () => void;
  onMessageContact: () => void;
  onViewBill: (billId: string) => void;
}

export default function ContactDetailScreen({
  contact,
  billRelationships,
  bills,
  onBack,
  onEditContact,
  onToggleFavorite,
  onCallContact,
  onMessageContact,
  onViewBill,
}: ContactDetailScreenProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#10B981'; // Green - they owe you
    if (balance < 0) return '#EF4444'; // Red - you owe them
    return '#6B7280'; // Gray - settled
  };

  const getBalanceText = (balance: number) => {
    if (balance > 0) return `Owes you ${formatCurrency(balance)}`;
    if (balance < 0) return `You owe ${formatCurrency(balance)}`;
    return 'Settled up';
  };

  const getBillStatus = (status: Bill['status']) => {
    switch (status) {
      case 'pending': return { text: 'Pending', color: '#FF6B6B' };
      case 'paid': return { text: 'Paid', color: '#10B981' };
      case 'cancelled': return { text: 'Cancelled', color: '#6B7280' };
      default: return { text: 'Unknown', color: '#6B7280' };
    }
  };

  const renderBillItem = ({ item }: { item: ContactBillRelationship }) => {
    const bill = bills.find(b => b.id === item.billId);
    if (!bill) return null;

    const statusInfo = getBillStatus(item.billStatus);
    const amount = item.amountOwed || item.amountTheyOwe;
    const isOwed = item.amountOwed > 0;

    return (
      <TouchableOpacity 
        style={styles.billItem}
        onPress={() => onViewBill(item.billId)}
      >
        <View style={styles.billIcon}>
          <Receipt size={20} color="#ffffff" />
        </View>
        
        <View style={styles.billInfo}>
          <Text style={styles.billTitle}>{bill.title}</Text>
          <Text style={styles.billDate}>
            {new Date(item.billDate).toLocaleDateString()}
          </Text>
          <View style={styles.billStatus}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        
        <View style={styles.billAmount}>
          <Text style={[styles.amountText, { color: isOwed ? '#10B981' : '#EF4444' }]}>
            {isOwed ? '+' : '-'}{formatCurrency(amount)}
          </Text>
          <Text style={styles.roleText}>
            {item.isOwner ? 'Owner' : 'Participant'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Details</Text>
        <TouchableOpacity onPress={onEditContact} style={styles.editButton}>
          <Edit size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </Text>
              {contact.isFavorite && (
                <View style={styles.favoriteIcon}>
                  <Star1 size={16} color="#FFD700" variant="Bold" />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.contactName}>
                {contact.firstName} {contact.lastName}
              </Text>
              {contact.group && (
                <Text style={styles.groupTag}>
                  {contact.group.charAt(0).toUpperCase() + contact.group.slice(1)}
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onCallContact}
            >
              <Call size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onMessageContact}
            >
              <Sms size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onToggleFavorite}
            >
              <Star1 
                size={20} 
                color={contact.isFavorite ? "#FFD700" : "#ffffff"} 
                variant={contact.isFavorite ? "Bold" : "Outline"}
              />
              <Text style={styles.actionButtonText}>
                {contact.isFavorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfoSection}>
          <View style={styles.infoItem}>
            <User size={16} color="#888888" />
            <Text style={styles.infoText}>{contact.email}</Text>
          </View>
          {contact.phone && (
            <View style={styles.infoItem}>
              <Call size={16} color="#888888" />
              <Text style={styles.infoText}>{contact.phone}</Text>
            </View>
          )}
        </View>

        {/* Balance Summary */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Balance Summary</Text>
          
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              {contact.stats.netBalance > 0 ? (
                <TrendUp size={24} color="#10B981" />
              ) : contact.stats.netBalance < 0 ? (
                <TrendDown size={24} color="#EF4444" />
              ) : (
                <User size={24} color="#6B7280" />
              )}
              
              <View style={styles.balanceInfo}>
                <Text style={[styles.balanceAmount, { color: getBalanceColor(contact.stats.netBalance) }]}>
                  {getBalanceText(contact.stats.netBalance)}
                </Text>
                <Text style={styles.balanceSubtext}>Net balance</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{contact.stats.totalBills}</Text>
              <Text style={styles.statLabel}>Total Bills</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{contact.stats.activeBills}</Text>
              <Text style={styles.statLabel}>Active Bills</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatCurrency(contact.stats.totalAmountInvolved)}</Text>
              <Text style={styles.statLabel}>Total Amount</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatCurrency(contact.stats.averageBillAmount)}</Text>
              <Text style={styles.statLabel}>Average Bill</Text>
            </View>
          </View>
        </View>

        {/* Bill History */}
        <View style={styles.billHistorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bill History</Text>
            <Text style={styles.billCount}>
              {billRelationships.length} {billRelationships.length === 1 ? 'bill' : 'bills'}
            </Text>
          </View>
          
          {billRelationships.length > 0 ? (
            <FlatList
              data={billRelationships}
              keyExtractor={(item) => item.billId}
              renderItem={renderBillItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyBills}>
              <Receipt size={48} color="#666666" />
              <Text style={styles.emptyBillsText}>No bills yet</Text>
              <Text style={styles.emptyBillsSubtext}>
                Create a bill together to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 24,
  },
  favoriteIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  groupTag: {
    fontSize: 14,
    color: '#888888',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 8,
    fontWeight: '500',
  },
  contactInfoSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  balanceSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceInfo: {
    marginLeft: 16,
    flex: 1,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  billHistorySection: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  billCount: {
    fontSize: 14,
    color: '#888888',
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  billDate: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  billStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 12,
    color: '#888888',
  },
  emptyBills: {
    alignItems: 'center',
    padding: 40,
  },
  emptyBillsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888888',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBillsSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
