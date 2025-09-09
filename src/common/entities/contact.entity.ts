export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profileImage?: string;
}

// Type for creating new contacts (excludes id)
export type CreateContact = Omit<Contact, 'id'>;

// Type for updating existing contacts (all fields optional except id)
export type UpdateContact = Partial<Contact> & { id: string };

// Utility functions for Contact entity
export const ContactUtils = {
  // Get full name
  getFullName: (contact: Contact): string => {
    return `${contact.firstName} ${contact.lastName}`.trim();
  },

  // Get initials for avatar display
  getInitials: (contact: Contact): string => {
    const firstInitial = contact.firstName.charAt(0).toUpperCase();
    const lastInitial = contact.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  },

  // Check if contact has profile image
  hasProfileImage: (contact: Contact): boolean => {
    return !!contact.profileImage && contact.profileImage.length > 0;
  },

  // Search in contact fields
  matchesSearch: (contact: Contact, searchTerm: string): boolean => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(lowerSearchTerm) ||
      contact.lastName.toLowerCase().includes(lowerSearchTerm) ||
      contact.email.toLowerCase().includes(lowerSearchTerm) ||
      contact.phone.includes(searchTerm) ||
      ContactUtils.getFullName(contact).toLowerCase().includes(lowerSearchTerm)
    );
  },

  // Validate contact data
  validateContact: (contact: CreateContact): string[] => {
    const errors: string[] = [];
    
    if (!contact.firstName.trim()) {
      errors.push('First name is required');
    }
    
    if (!contact.lastName.trim()) {
      errors.push('Last name is required');
    }
    
    if (!contact.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.push('Email format is invalid');
    }
    
    return errors;
  },

  // Create contact with display properties
  withDisplayProperties: (contact: Contact) => ({
    ...contact,
    fullName: ContactUtils.getFullName(contact),
    initials: ContactUtils.getInitials(contact),
  }),
};
