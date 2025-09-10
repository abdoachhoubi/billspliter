import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { HardDrive, RefreshCw, Plus, X } from 'lucide-react-native';
import { Contact, CreateContact, ContactUtils } from '../common/entities/contact.entity';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectContactsWithFullName,
  selectContactsLoading,
  selectContactsError,
  selectSearchResultsWithFullName,
  selectIsSearching,
  selectIsHydrated,
  selectHasLocalData,
} from '../store/selectors/contactsSelectors';
import {
  fetchContacts,
  createContact,
  deleteContact,
  searchContacts,
} from '../store/thunks/contactsThunks';
import { clearSearchResults, clearContacts } from '../store/slices/contactsSlice';
import { ContactsService } from '../services/contactsService';

// Extended type for display purposes
interface ContactWithDisplay extends Contact {
  fullName: string;
  initials: string;
}

export default function ContactsScreen() {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContactsWithFullName);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);
  const searchResults = useAppSelector(selectSearchResultsWithFullName);
  const isSearching = useAppSelector(selectIsSearching);
  const isHydrated = useAppSelector(selectIsHydrated);
  const hasLocalData = useAppSelector(selectHasLocalData);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [newContact, setNewContact] = useState<CreateContact>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    // Only fetch from API if we don't have hydrated local data
    if (!hasLocalData) {
      dispatch(fetchContacts());
    }
  }, [dispatch, hasLocalData]);

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchContacts(searchQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [searchQuery, dispatch]);

  const handleAddContact = () => {
    const validationErrors = ContactUtils.validateContact(newContact);
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n'));
      return;
    }

    dispatch(createContact(newContact)).then(() => {
      setNewContact({ firstName: '', lastName: '', phone: '', email: '' });
      setShowAddForm(false);
    });
  };

  const handleDeleteContact = (id: string, name: string) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteContact(id)),
        },
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchContacts());
  };

  const handleClearLocalData = () => {
    Alert.alert(
      'Clear Local Data',
      'This will remove all contacts from local storage. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await ContactsService.clearLocalData();
            dispatch(clearContacts());
            dispatch(fetchContacts());
          },
        },
      ]
    );
  };

  const displayContacts: ContactWithDisplay[] = searchQuery.trim() ? searchResults : contacts;

  const renderContact = ({ item }: { item: ContactWithDisplay }) => (
    <View style={styles.contactItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.fullName}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id, item.fullName)}
      >
        <X size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !hasLocalData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Contacts ({contacts.length})</Text>
          {hasLocalData && (
            <View style={styles.persistedIndicator}>
              <HardDrive size={12} color="#888888" />
              <Text style={styles.persistedText}>Saved Locally</Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <RefreshCw size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <X size={20} color="#000000" />
            ) : (
              <Plus size={20} color="#000000" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        placeholderTextColor="#888888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            placeholderTextColor="#888888"
            value={newContact.firstName}
            onChangeText={(text) => setNewContact({ ...newContact, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            placeholderTextColor="#888888"
            value={newContact.lastName}
            onChangeText={(text) => setNewContact({ ...newContact, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#888888"
            value={newContact.email}
            onChangeText={(text) => setNewContact({ ...newContact, email: text })}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#888888"
            value={newContact.phone}
            onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddContact}>
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isSearching && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      )}

      <FlatList
        data={displayContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#000000',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  persistedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  persistedText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButton: {
    backgroundColor: '#ffffff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 17,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 0,
    color: '#ffffff',
    fontWeight: '500',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addForm: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 17,
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 17,
    color: '#888888',
    fontWeight: '500',
  },
  searchingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#888888',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
});
