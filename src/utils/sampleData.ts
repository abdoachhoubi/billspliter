import { Bill, BillParticipant, BillOwner } from '../common/entities/bill.entity';

// Sample data for testing the bills functionality
export const sampleBills: Bill[] = [
  {
    id: 'bill-1',
    title: 'Dinner at Restaurant',
    description: 'Italian dinner with friends',
    totalAmount: 120.50,
    splitType: 'amount',
    owner: {
      user: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      splitValue: 40.50,
      amountToPay: 40.50,
    },
    participants: [
      {
        user: {
          id: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
        splitValue: 40.00,
        amountToPay: 40.00,
      },
      {
        user: {
          id: 'user-3',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
        },
        splitValue: 40.00,
        amountToPay: 40.00,
      },
    ],
    creationDate: new Date('2025-09-10'),
    lastModified: new Date('2025-09-10'),
    status: 'pending',
  },
  {
    id: 'bill-2',
    title: 'Weekend Trip',
    description: 'Cabin rental and expenses',
    totalAmount: 480.00,
    splitType: 'percentage',
    owner: {
      user: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      splitValue: 50,
      amountToPay: 240.00,
    },
    participants: [
      {
        user: {
          id: 'user-4',
          firstName: 'Alice',
          lastName: 'Wilson',
          email: 'alice.wilson@example.com',
        },
        splitValue: 25,
        amountToPay: 120.00,
      },
      {
        user: {
          id: 'user-5',
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'mike.davis@example.com',
        },
        splitValue: 25,
        amountToPay: 120.00,
      },
    ],
    creationDate: new Date('2025-09-08'),
    lastModified: new Date('2025-09-08'),
    status: 'paid',
  },
  {
    id: 'bill-3',
    title: 'Grocery Shopping',
    description: 'Weekly groceries',
    totalAmount: 85.75,
    splitType: 'amount',
    owner: {
      user: {
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      },
      splitValue: 42.75,
      amountToPay: 42.75,
    },
    participants: [
      {
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        splitValue: 43.00,
        amountToPay: 43.00,
      },
    ],
    creationDate: new Date('2025-09-12'),
    lastModified: new Date('2025-09-12'),
    status: 'pending',
  },
  {
    id: 'bill-4',
    title: 'Concert Tickets',
    description: 'Music festival tickets',
    totalAmount: 200.00,
    splitType: 'percentage',
    owner: {
      user: {
        id: 'user-3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
      },
      splitValue: 33.33,
      amountToPay: 66.66,
    },
    participants: [
      {
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        splitValue: 33.33,
        amountToPay: 66.66,
      },
      {
        user: {
          id: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
        splitValue: 33.34,
        amountToPay: 66.68,
      },
    ],
    creationDate: new Date('2025-09-05'),
    lastModified: new Date('2025-09-05'),
    status: 'cancelled',
  },
];

export const sampleContacts = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
  },
  {
    id: 'user-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1122334455',
  },
  {
    id: 'user-4',
    firstName: 'Alice',
    lastName: 'Wilson',
    email: 'alice.wilson@example.com',
    phone: '+5566778899',
  },
  {
    id: 'user-5',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@example.com',
    phone: '+9988776655',
  },
];
