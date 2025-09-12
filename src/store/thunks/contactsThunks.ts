import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contact, CreateContact } from '../../common/entities/contact.entity';
import { ContactsService } from '../../services/contactsService';

// Fetch all contacts
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const contacts = await ContactsService.getAllContacts();
      return contacts;
    } catch (error) {
      return rejectWithValue('Failed to fetch contacts');
    }
  }
);

// Create a new contact
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: CreateContact, { rejectWithValue }) => {
    try {
      const newContact = await ContactsService.createContact(contactData);
      return newContact;
    } catch (error) {
      return rejectWithValue('Failed to create contact');
    }
  }
);

// Update a contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (
    { id, updates }: { id: string; updates: Partial<CreateContact> },
    { rejectWithValue }
  ) => {
    try {
      const updatedContact = await ContactsService.updateContact(id, updates);
      if (!updatedContact) {
        return rejectWithValue('Contact not found');
      }
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to update contact');
    }
  }
);

// Delete a contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await ContactsService.deleteContact(id);
      if (!success) {
        return rejectWithValue('Contact not found');
      }
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete contact');
    }
  }
);

// Search contacts
export const searchContacts = createAsyncThunk(
  'contacts/searchContacts',
  async (query: string, { rejectWithValue }) => {
    try {
      const contacts = await ContactsService.searchContacts(query);
      return contacts;
    } catch (error) {
      return rejectWithValue('Failed to search contacts');
    }
  }
);

// Toggle favorite status
export const toggleContactFavorite = createAsyncThunk(
  'contacts/toggleFavorite',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const updatedContact = await ContactsService.toggleFavorite(contactId);
      if (!updatedContact) {
        return rejectWithValue('Contact not found');
      }
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to toggle favorite');
    }
  }
);

// Update contact group
export const updateContactGroup = createAsyncThunk(
  'contacts/updateGroup',
  async (
    { contactId, group }: { contactId: string; group: Contact['group'] },
    { rejectWithValue }
  ) => {
    try {
      const updatedContact = await ContactsService.updateContactGroup(contactId, group);
      if (!updatedContact) {
        return rejectWithValue('Contact not found');
      }
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to update contact group');
    }
  }
);

// Add contact notes
export const addContactNotes = createAsyncThunk(
  'contacts/addNotes',
  async (
    { contactId, notes }: { contactId: string; notes: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedContact = await ContactsService.addContactNotes(contactId, notes);
      if (!updatedContact) {
        return rejectWithValue('Contact not found');
      }
      return updatedContact;
    } catch (error) {
      return rejectWithValue('Failed to add contact notes');
    }
  }
);
