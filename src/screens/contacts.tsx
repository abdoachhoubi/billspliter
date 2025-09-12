import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HardDrive, RefreshCw, Plus, X } from 'lucide-react-native';
import {
  Contact,
  CreateContact,
  ContactUtils,
} from '../common/entities/contact.entity';
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
import {
  clearSearchResults,
  clearContacts,
} from '../store/slices/contactsSlice';
import { ContactsService } from '../services/contactsService';
import {
  ContactItem,
  SearchInput,
  CircularIconButton,
  LoadingState,
  EmptyState,
  ErrorContainer,
  ContactForm,
} from '../common/components';

// Extended type for display purposes
interface ContactWithDisplay extends Contact {
  fullName: string;
  initials: string;
}

export default function ContactsScreen() {
  const { t } = useTranslation();
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
      t('contacts.delete_contact_title'),
      t('contacts.delete_contact_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
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
      t('contacts.clear_contacts_title'),
      t('contacts.clear_contacts_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.clear'),
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

  const displayContacts: ContactWithDisplay[] = searchQuery.trim()
    ? searchResults
    : contacts;

  const renderContact = ({ item }: { item: ContactWithDisplay }) => (
    <ContactItem
      id={item.id}
      fullName={item.fullName}
      email={item.email}
      phone={item.phone}
      initials={item.initials}
      onDelete={handleDeleteContact}
    />
  );

  if (loading && !hasLocalData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <LoadingState message={t('common.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {t('contacts.title')} ({contacts.length})
          </Text>
          {hasLocalData && (
            <View style={styles.persistedIndicator}>
              <HardDrive size={12} color="#888888" />
              <Text style={styles.persistedText}>Saved Locally</Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          <CircularIconButton Icon={RefreshCw} onPress={handleRefresh} />
          <CircularIconButton
            Icon={showAddForm ? X : Plus}
            backgroundColor="#ffffff"
            iconColor="#000000"
            onPress={() => setShowAddForm(!showAddForm)}
          />
        </View>
      </View>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('contacts.search_placeholder')}
      />

      {showAddForm && (
        <ContactForm
          contact={newContact}
          onContactChange={setNewContact}
          onSave={handleAddContact}
        />
      )}

      {error && <ErrorContainer message={error} />}

      {isSearching && (
        <View style={styles.centerContainer}>
          <LoadingState message={t('contacts.searching')} size="small" />
        </View>
      )}

      <FlatList
        data={displayContacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isSearching ? (
            <EmptyState
              message={searchQuery ? 'No Contacts Found' : 'No Contacts Yet'}
              subtitle={
                searchQuery
                  ? 'Try adjusting your search terms or add a new contact'
                  : 'Add your first contact to start splitting bills'
              }
              actionText={!searchQuery ? 'Add Contact' : undefined}
              onAction={!searchQuery ? () => setShowAddForm(true) : undefined}
            />
          ) : null
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
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
