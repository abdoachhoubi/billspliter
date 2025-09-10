import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface ContactItemProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  initials: string;
  onDelete: (id: string, name: string) => void;
}

export default function ContactItem({ 
  id, 
  fullName, 
  email, 
  phone, 
  initials, 
  onDelete 
}: ContactItemProps) {
  return (
    <View style={styles.contactItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{fullName}</Text>
        <Text style={styles.contactEmail}>{email}</Text>
        <Text style={styles.contactPhone}>{phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id, fullName)}
      >
        <X size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
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
  },
  avatarText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.2,
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
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
  },
});
