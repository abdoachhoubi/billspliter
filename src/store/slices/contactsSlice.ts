import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import {
  Contact,
  CreateContact,
  UpdateContact,
} from '../../common/entities/contact.entity';
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  toggleContactFavorite,
  updateContactGroup,
  addContactNotes,
} from '../thunks/contactsThunks';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  searchResults: Contact[];
  isSearching: boolean;
  isHydrated: boolean; // Track if data has been loaded from storage
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
  searchResults: [],
  isSearching: false,
  isHydrated: false,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Set contacts array
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear search results
    clearSearchResults: state => {
      state.searchResults = [];
      state.isSearching = false;
    },

    // Clear all contacts
    clearContacts: state => {
      state.contacts = [];
    },

    // Add contact directly (for immediate UI updates)
    addContactLocal: (state, action: PayloadAction<Contact>) => {
      const existingIndex = state.contacts.findIndex(
        c => c.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.contacts.push(action.payload);
      }
    },

    // Update contact directly (for immediate UI updates)
    updateContactLocal: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },

    // Delete contact directly (for immediate UI updates)
    deleteContactLocal: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
  },
  extraReducers: builder => {
    // Handle rehydration
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.contacts) {
        state.isHydrated = true;
        // Merge persisted contacts with current state
        state.contacts = action.payload.contacts.contacts || [];
      }
    });

    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, state => {
        // Only show loading if we don't have hydrated data
        if (!state.isHydrated || state.contacts.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        // Only update if we don't have local data or if we're doing a refresh
        if (!state.isHydrated || state.contacts.length === 0) {
          state.contacts = action.payload;
        }
        state.isHydrated = true;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create contact
    builder
      .addCase(createContact.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        // Add to local state immediately
        const existingIndex = state.contacts.findIndex(
          c => c.id === action.payload.id
        );
        if (existingIndex === -1) {
          state.contacts.push(action.payload);
        }
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update contact
    builder
      .addCase(updateContact.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(
          contact => contact.id === action.payload.id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete contact
    builder
      .addCase(deleteContact.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          contact => contact.id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search contacts
    builder
      .addCase(searchContacts.pending, state => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      });

    // Toggle favorite
    builder
      .addCase(toggleContactFavorite.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          contact => contact.id === action.payload.id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(toggleContactFavorite.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update group
    builder
      .addCase(updateContactGroup.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          contact => contact.id === action.payload.id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContactGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Add notes
    builder
      .addCase(addContactNotes.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          contact => contact.id === action.payload.id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(addContactNotes.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setContacts,
  setError,
  clearSearchResults,
  clearContacts,
  addContactLocal,
  updateContactLocal,
  deleteContactLocal,
} = contactsSlice.actions;

export default contactsSlice.reducer;
