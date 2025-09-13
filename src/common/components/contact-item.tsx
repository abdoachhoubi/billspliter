import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CloseCircle, Star1, Receipt, TrendUp, TrendDown } from 'iconsax-react-nativejs';
import { ContactStats } from '../entities/contact.entity';

interface ContactItemProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  initials: string;
  isFavorite?: boolean;
  group?: 'family' | 'friends' | 'work' | 'other';
  stats?: ContactStats;
  showStats?: boolean;
  onDelete: (id: string, name: string) => void;
  onPress?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function ContactItem({
  id,
  fullName,
  email,
  phone,
  initials,
  isFavorite = false,
  group,
  stats,
  showStats = false,
  onDelete,
  onPress,
  onToggleFavorite,
}: ContactItemProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

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

  return (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
        {isFavorite && (
          <View style={styles.favoriteIcon}>
            <Star1 size={12} color="#FFD700" variant="Bold" />
          </View>
        )}
      </View>
      
      <View style={styles.contactInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.contactName}>{fullName}</Text>
          {onToggleFavorite && (
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <Star1 
                size={16} 
                color={isFavorite ? "#FFD700" : "#666666"} 
                variant={isFavorite ? "Bold" : "Outline"} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.contactEmail}>{email}</Text>
        {phone && <Text style={styles.contactPhone}>{phone}</Text>}
        
        {group && (
          <Text style={styles.groupTag}>{group.charAt(0).toUpperCase() + group.slice(1)}</Text>
        )}
        
        {showStats && stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Receipt size={14} color="#888888" />
                <Text style={styles.statText}>{stats.totalBills} bills</Text>
              </View>
              
              {stats.activeBills > 0 && (
                <View style={styles.statItem}>
                  <View style={[styles.activeDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={styles.statText}>{stats.activeBills} active</Text>
                </View>
              )}
            </View>
            
            {stats.netBalance !== 0 && (
              <View style={styles.balanceRow}>
                {stats.netBalance > 0 ? (
                  <TrendUp size={14} color="#10B981" />
                ) : (
                  <TrendDown size={14} color="#EF4444" />
                )}
                <Text style={[styles.balanceText, { color: getBalanceColor(stats.netBalance) }]}>
                  {getBalanceText(stats.netBalance)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id, fullName)}
      >
        <CloseCircle size={16} color="#ffffff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  avatarText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.5,
  },
  favoriteIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  contactInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  contactEmail: {
    fontSize: 15,
    color: '#bbbbbb',
    marginBottom: 3,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '400',
    marginBottom: 6,
  },
  groupTag: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 13,
    color: '#cccccc',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
});
