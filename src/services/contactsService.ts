import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Contact,
  CreateContact,
  ContactUtils,
} from '../common/entities/contact.entity';

// Storage keys
const CONTACTS_STORAGE_KEY = 'contacts_data';
const LAST_SYNC_KEY = 'contacts_last_sync';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () =>
  `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default contacts for new installations
const defaultContacts: Contact[] = [
  {
    id: 'default_1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    email: 'john.doe@example.com',
    profileImage: undefined,
  },
  {
    id: 'default_2',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    email: 'jane.smith@example.com',
    profileImage: undefined,
  },
];

export class ContactsService {
  // Load contacts from local storage
  static async loadLocalContacts(): Promise<Contact[]> {
    try {
      const storedContacts = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedContacts) {
        return JSON.parse(storedContacts);
      }

      // If no contacts stored, use defaults and save them
      await this.saveLocalContacts(defaultContacts);
      return defaultContacts;
    } catch (error) {
      console.error('Error loading local contacts:', error);
      return defaultContacts;
    }
  }

  // Save contacts to local storage
  static async saveLocalContacts(contacts: Contact[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CONTACTS_STORAGE_KEY,
        JSON.stringify(contacts)
      );
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error saving local contacts:', error);
    }
  }

  // Get all contacts (prioritize local storage)
  static async getAllContacts(): Promise<Contact[]> {
    try {
      // First try to load from local storage
      const localContacts = await this.loadLocalContacts();

      // Simulate API call delay for realism
      await delay(300);

      return localContacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return defaultContacts;
    }
  }

  // Get contact by ID
  static async getContactById(id: string): Promise<Contact | null> {
    try {
      const contacts = await this.loadLocalContacts();
      return contacts.find(contact => contact.id === id) || null;
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      return null;
    }
  }

  // Create new contact
  static async createContact(contactData: CreateContact): Promise<Contact> {
    try {
      // Validate contact data
      const validationErrors = ContactUtils.validateContact(contactData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Load existing contacts
      const contacts = await this.loadLocalContacts();

      // Create new contact
      const newContact: Contact = {
        ...contactData,
        id: generateId(),
      };

      // Add to contacts array
      const updatedContacts = [...contacts, newContact];

      // Save to local storage
      await this.saveLocalContacts(updatedContacts);

      // Simulate API delay
      await delay(300);

      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  // Update contact
  static async updateContact(
    id: string,
    updates: Partial<CreateContact>
  ): Promise<Contact | null> {
    try {
      const contacts = await this.loadLocalContacts();
      const contactIndex = contacts.findIndex(contact => contact.id === id);

      if (contactIndex === -1) {
        throw new Error('Contact not found');
      }

      const updatedContact = { ...contacts[contactIndex], ...updates };

      // Validate updated contact data
      const validationErrors = ContactUtils.validateContact(updatedContact);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Update contacts array
      contacts[contactIndex] = updatedContact;

      // Save to local storage
      await this.saveLocalContacts(contacts);

      // Simulate API delay
      await delay(300);

      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  // Delete contact
  static async deleteContact(id: string): Promise<boolean> {
    try {
      const contacts = await this.loadLocalContacts();
      const filteredContacts = contacts.filter(contact => contact.id !== id);

      if (filteredContacts.length === contacts.length) {
        throw new Error('Contact not found');
      }

      // Save updated contacts
      await this.saveLocalContacts(filteredContacts);

      // Simulate API delay
      await delay(300);

      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Search contacts
  static async searchContacts(query: string): Promise<Contact[]> {
    try {
      const contacts = await this.loadLocalContacts();
      const results = contacts.filter(contact =>
        ContactUtils.matchesSearch(contact, query)
      );

      // Simulate API delay
      await delay(200);

      return results;
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }

  // Clear all local data (useful for testing or logout)
  static async clearLocalData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONTACTS_STORAGE_KEY);
      await AsyncStorage.removeItem(LAST_SYNC_KEY);
    } catch (error) {
      console.error('Error clearing local data:', error);
    }
  }

  // Get last sync timestamp
  static async getLastSyncTime(): Promise<Date | null> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }
}
