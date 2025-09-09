import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ContactUtils } from '../../common/entities/contact.entity';

// Basic selectors
export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsLoading = (state: RootState) => state.contacts.loading;
export const selectContactsError = (state: RootState) => state.contacts.error;
export const selectSearchResults = (state: RootState) => state.contacts.searchResults;
export const selectIsSearching = (state: RootState) => state.contacts.isSearching;
export const selectIsHydrated = (state: RootState) => state.contacts.isHydrated;

// Memoized selectors
export const selectContactsCount = createSelector(
  [selectContacts],
  (contacts) => contacts.length
);

export const selectContactById = createSelector(
  [selectContacts, (state: RootState, contactId: string) => contactId],
  (contacts, contactId) => contacts.find(contact => contact.id === contactId)
);

export const selectContactsByName = createSelector(
  [selectContacts],
  (contacts) => 
    contacts.slice().sort((a, b) => 
      ContactUtils.getFullName(a).localeCompare(ContactUtils.getFullName(b))
    )
);

export const selectContactsWithSearch = createSelector(
  [selectContacts, (state: RootState, searchTerm: string) => searchTerm],
  (contacts, searchTerm) => {
    if (!searchTerm) return contacts;
    
    return contacts.filter(contact => ContactUtils.matchesSearch(contact, searchTerm));
  }
);

// Get contacts with full name for display
export const selectContactsWithFullName = createSelector(
  [selectContacts],
  (contacts) => contacts.map(ContactUtils.withDisplayProperties)
);

// Get search results with full name for display
export const selectSearchResultsWithFullName = createSelector(
  [selectSearchResults],
  (contacts) => contacts.map(ContactUtils.withDisplayProperties)
);

// Check if we have local data available
export const selectHasLocalData = createSelector(
  [selectContacts, selectIsHydrated],
  (contacts, isHydrated) => isHydrated && contacts.length > 0
);
