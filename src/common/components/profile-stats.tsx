import { Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  value: string;
  unit?: string;
  label: string;
  subtitle: string;
  onPress: () => void;
  showAddButton?: boolean;
}

interface ProfileStatsProps {
  stats: Array<StatCardProps>;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <TouchableOpacity
          key={index}
          style={styles.statCard}
          onPress={stat.onPress}
        >
          <View style={styles.cardHeader}>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{stat.value}</Text>
              {stat.unit && <Text style={styles.unit}>{stat.unit}</Text>}
            </View>
            {stat.showAddButton && (
              <TouchableOpacity style={styles.addButton}>
                <Plus size={16} color="#888888" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{stat.label}</Text>
            <Text style={styles.subtitle}>{stat.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    aspectRatio: 2,
  },
  statCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 36,
  },
  unit: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 2,
    fontWeight: '500',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
	flexDirection: 'column',
	gap: 4,
  },
  label: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 16,
  },
});
