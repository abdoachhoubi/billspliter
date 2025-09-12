import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ContactUtils } from '../../common/entities/contact.entity';
import { ContactBillUtils } from '../../common/utils/contact-bill-utils';

// Basic selectors
export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsLoading = (state: RootState) =>
  state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectSearchResults = (state: RootState) =>
  state.contacts.searchResults;
export const selectIsSearching = (state: RootState) =>
  state.contacts.isSearching;
export const selectIsHydrated = (state: RootState) => state.contacts.isHydrated;

// Bills selector for calculations
export const selectBills = (state: RootState) => state.bills?.bills || [];
// For now, using a static current user ID since auth is removed
export const selectCurrentUserId = () => 'current-user'; // TODO: Replace with actual user management when needed

// Memoized selectors
export const selectContactsCount = createSelector(
  [selectContacts],
  contacts => contacts.length
);

export const selectContactById = createSelector(
  [selectContacts, (state: RootState, contactId: string) => contactId],
  (contacts, contactId) => contacts.find(contact => contact.id === contactId)
);

export const selectContactsByName = createSelector([selectContacts], contacts =>
  contacts
    .slice()
    .sort((a, b) =>
      ContactUtils.getFullName(a).localeCompare(ContactUtils.getFullName(b))
    )
);

export const selectContactsWithSearch = createSelector(
  [selectContacts, (state: RootState, searchTerm: string) => searchTerm],
  (contacts, searchTerm) => {
    if (!searchTerm) return contacts;

    return contacts.filter(contact =>
      ContactUtils.matchesSearch(contact, searchTerm)
    );
  }
);

// Get contacts with full name for display
export const selectContactsWithFullName = createSelector(
  [selectContacts],
  contacts => contacts.map(ContactUtils.withDisplayProperties)
);

// Get search results with full name for display
export const selectSearchResultsWithFullName = createSelector(
  [selectSearchResults],
  contacts => contacts.map(ContactUtils.withDisplayProperties)
);

// Check if we have local data available
export const selectHasLocalData = createSelector(
  [selectContacts, selectIsHydrated],
  (contacts, isHydrated) => isHydrated && contacts.length > 0
);

// Get contacts with bill statistics
export const selectContactsWithStats = createSelector(
  [selectContacts, selectBills, selectCurrentUserId],
  (contacts, bills, currentUserId) => 
    ContactBillUtils.getContactsWithStats(contacts, bills, currentUserId)
);

// Get contacts with statistics filtered by balance
export const selectContactsByBalance = createSelector(
  [selectContactsWithStats, (state: RootState, filter: 'owes-you' | 'you-owe' | 'settled' | 'active' | 'all') => filter],
  (contactsWithStats, filter) => 
    ContactBillUtils.filterContactsByBalance(contactsWithStats, filter)
);

// Get frequent contacts
export const selectFrequentContacts = createSelector(
  [selectContactsWithStats],
  (contactsWithStats) => 
    ContactBillUtils.getFrequentContacts(contactsWithStats, 5)
);

// Get recent contacts
export const selectRecentContacts = createSelector(
  [selectContactsWithStats],
  (contactsWithStats) => 
    ContactBillUtils.getRecentContacts(contactsWithStats, 5)
);

// Get contacts sorted by various criteria
export const selectContactsSorted = createSelector(
  [selectContactsWithStats, (state: RootState, sortBy: 'name' | 'balance' | 'activity' | 'bills-count' | 'recent') => sortBy],
  (contactsWithStats, sortBy) => 
    ContactBillUtils.sortContacts(contactsWithStats, sortBy)
);

// Get contact with statistics by ID
export const selectContactWithStatsById = createSelector(
  [selectContactsWithStats, (state: RootState, contactId: string) => contactId],
  (contactsWithStats, contactId) => 
    contactsWithStats.find(contact => contact.id === contactId)
);

// Get contact bill relationships
export const selectContactBillRelationships = createSelector(
  [selectBills, selectCurrentUserId, (state: RootState, contactId: string) => contactId],
  (bills, currentUserId, contactId) => 
    ContactBillUtils.getContactBillRelationships(bills, contactId, currentUserId)
);
