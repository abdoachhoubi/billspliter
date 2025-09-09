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
