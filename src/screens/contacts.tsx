import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Archive, Refresh, Add, CloseCircle, Sort, Filter } from 'iconsax-react-nativejs';
import {
  Contact,
  CreateContact,
  ContactUtils,
  ContactWithStats,
} from '../common/entities/contact.entity';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectContactsWithStats,
  selectContactsLoading,
  selectContactsError,
  selectSearchResultsWithFullName,
  selectIsSearching,
  selectIsHydrated,
  selectHasLocalData,
  selectContactsSorted,
  selectContactsByBalance,
} from '../store/selectors/contactsSelectors';
import {
  fetchContacts,
  createContact,
  deleteContact,
  searchContacts,
  toggleContactFavorite,
  updateContactGroup,
  addContactNotes,
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
interface ContactWithDisplay extends ContactWithStats {
  fullName: string;
  initials: string;
}

interface ContactsScreenProps {
  onViewContactDetail?: (contact: ContactWithStats) => void;
}

export default function ContactsScreen({ onViewContactDetail }: ContactsScreenProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const contactsWithStats = useAppSelector(selectContactsWithStats);
  const loading = useAppSelector(selectContactsLoading);
  const error = useAppSelector(selectContactsError);
  const searchResults = useAppSelector(selectSearchResultsWithFullName);
  const isSearching = useAppSelector(selectIsSearching);
  const isHydrated = useAppSelector(selectIsHydrated);
  const hasLocalData = useAppSelector(selectHasLocalData);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'activity' | 'bills-count' | 'recent'>('name');
  const [filterBy, setFilterBy] = useState<'owes-you' | 'you-owe' | 'settled' | 'active' | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | 'family' | 'friends' | 'work' | 'other' | 'favorites'>('all');
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

  // Get filtered and sorted contacts
  const filteredAndSortedContacts = useMemo(() => {
    let result = searchQuery.trim()
      ? searchResults.map(contact => {
          const withStats = contactsWithStats.find(c => c.id === contact.id);
          return {
            ...ContactUtils.withDisplayProperties(contact),
            stats: withStats?.stats || {
              totalBills: 0,
              activeBills: 0,
              totalAmountInvolved: 0,
              balanceOwedToYou: 0,
              balanceYouOwe: 0,
              netBalance: 0,
              averageBillAmount: 0,
            }
          };
        })
      : contactsWithStats.map(contact => ({
          ...ContactUtils.withDisplayProperties(contact),
          stats: contact.stats,
        }));

    // Apply filtering
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'owes-you':
          result = result.filter(c => c.stats.netBalance > 0);
          break;
        case 'you-owe':
          result = result.filter(c => c.stats.netBalance < 0);
          break;
        case 'settled':
          result = result.filter(c => c.stats.netBalance === 0 && c.stats.totalBills > 0);
          break;
        case 'active':
          result = result.filter(c => c.stats.activeBills > 0);
          break;
      }
    }

    // Apply group filtering
    if (groupFilter !== 'all') {
      switch (groupFilter) {
        case 'favorites':
          result = result.filter(c => c.isFavorite === true);
          break;
        case 'family':
        case 'friends':
        case 'work':
        case 'other':
          result = result.filter(c => c.group === groupFilter);
          break;
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.firstName.localeCompare(b.firstName);
        case 'balance':
          return Math.abs(b.stats.netBalance) - Math.abs(a.stats.netBalance);
        case 'activity':
          if (!a.stats.lastBillDate && !b.stats.lastBillDate) return 0;
          if (!a.stats.lastBillDate) return 1;
          if (!b.stats.lastBillDate) return -1;
          return new Date(b.stats.lastBillDate).getTime() - new Date(a.stats.lastBillDate).getTime();
        case 'bills-count':
          return b.stats.totalBills - a.stats.totalBills;
        case 'recent':
          if (!a.lastActivityAt && !b.lastActivityAt) return 0;
          if (!a.lastActivityAt) return 1;
          if (!b.lastActivityAt) return -1;
          return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [contactsWithStats, searchResults, searchQuery, filterBy, sortBy, groupFilter]);

  const displayContacts: ContactWithDisplay[] = filteredAndSortedContacts;

  const renderContact = ({ item }: { item: ContactWithDisplay }) => (
    <ContactItem
      id={item.id}
      fullName={item.fullName}
      email={item.email}
      phone={item.phone}
      initials={item.initials}
      isFavorite={item.isFavorite}
      group={item.group}
      stats={item.stats}
      showStats={showStats}
      onDelete={handleDeleteContact}
      onPress={(contactId) => {
        const contact = contactsWithStats.find(c => c.id === contactId);
        if (contact && onViewContactDetail) {
          onViewContactDetail(contact);
        } else {
          console.log('Contact pressed:', contactId);
        }
      }}
      onToggleFavorite={(contactId) => {
        dispatch(toggleContactFavorite(contactId));
      }}
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
            {t('contacts.title')} ({displayContacts.length})
          </Text>
          {hasLocalData && (
            <View style={styles.persistedIndicator}>
              <Archive size={12} color="#888888" />
              <Text style={styles.persistedText}>Saved Locally</Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          <CircularIconButton 
            Icon={Sort} 
            onPress={() => {
              // Cycle through sort options
              const sortOptions: typeof sortBy[] = ['name', 'balance', 'activity', 'bills-count', 'recent'];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex]);
            }} 
          />
          <CircularIconButton 
            Icon={Filter} 
            onPress={() => {
              // Cycle through filter options
              const filterOptions: typeof filterBy[] = ['all', 'active', 'owes-you', 'you-owe', 'settled'];
              const currentIndex = filterOptions.indexOf(filterBy);
              const nextIndex = (currentIndex + 1) % filterOptions.length;
              setFilterBy(filterOptions[nextIndex]);
            }} 
          />
          <CircularIconButton Icon={Refresh} onPress={handleRefresh} />
          <CircularIconButton
            Icon={showAddForm ? CloseCircle : Add}
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

      {/* Filter and Sort Status Bar */}
      {(filterBy !== 'all' || sortBy !== 'name' || groupFilter !== 'all') && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {groupFilter !== 'all' && `Group: ${groupFilter}`}
            {groupFilter !== 'all' && (filterBy !== 'all' || sortBy !== 'name') && ' • '}
            {filterBy !== 'all' && `Filter: ${filterBy.replace('-', ' ')}`}
            {filterBy !== 'all' && sortBy !== 'name' && ' • '}
            {sortBy !== 'name' && `Sort: ${sortBy.replace('-', ' ')}`}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              setFilterBy('all');
              setSortBy('name');
              setGroupFilter('all');
            }}
            style={styles.clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Group Filter Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.groupFilters}
        contentContainerStyle={styles.groupFiltersContent}
      >
        {[
          { key: 'all', label: 'All', icon: '👥' },
          { key: 'favorites', label: 'Favorites', icon: '⭐' },
          { key: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
          { key: 'friends', label: 'Friends', icon: '👯' },
          { key: 'work', label: 'Work', icon: '💼' },
          { key: 'other', label: 'Other', icon: '📝' },
        ].map(({ key, label, icon }) => (
          <TouchableOpacity
            key={key}
            onPress={() => setGroupFilter(key as typeof groupFilter)}
            style={[
              styles.groupFilterPill,
              groupFilter === key && styles.groupFilterPillActive
            ]}
          >
            <Text style={styles.groupFilterIcon}>{icon}</Text>
            <Text style={[
              styles.groupFilterText,
              groupFilter === key && styles.groupFilterTextActive
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  clearFilters: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  groupFilters: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  groupFiltersContent: {
    paddingRight: 24,
  },
  groupFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  groupFilterPillActive: {
    backgroundColor: '#333333',
    borderColor: '#ffffff',
  },
  groupFilterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  groupFilterText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  groupFilterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
