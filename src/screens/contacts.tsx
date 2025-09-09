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
        <X size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !hasLocalData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
              <HardDrive size={12} color="#10b981" />
              <Text style={styles.persistedText}>Saved Locally</Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <RefreshCw size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <View style={styles.buttonContent}>
                <X size={16} color="white" />
                <Text style={styles.addButtonText}>Cancel</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Plus size={16} color="white" />
                <Text style={styles.addButtonText}>Add</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            value={newContact.firstName}
            onChangeText={(text) => setNewContact({ ...newContact, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            value={newContact.lastName}
            onChangeText={(text) => setNewContact({ ...newContact, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={newContact.email}
            onChangeText={(text) => setNewContact({ ...newContact, email: text })}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
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
          <ActivityIndicator size="small" color="#3b82f6" />
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
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  persistedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  persistedText: {
    fontSize: 12,
    color: '#10b981',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  contactItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
});
