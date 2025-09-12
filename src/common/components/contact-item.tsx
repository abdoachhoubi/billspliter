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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  avatarText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 20,
  },
  favoriteIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  contactEmail: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 2,
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '400',
    marginBottom: 4,
  },
  groupTag: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statsContainer: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
  },
});
