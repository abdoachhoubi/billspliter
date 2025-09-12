import { Contact, ContactStats, ContactWithStats } from '../entities/contact.entity';
import { Bill, BillParticipant } from '../entities/bill.entity';

export interface ContactBillRelationship {
  contactId: string;
  billId: string;
  amountOwed: number; // Amount the contact owes you
  amountTheyOwe: number; // Amount you owe the contact
  isOwner: boolean;
  isParticipant: boolean;
  billStatus: Bill['status'];
  billDate: string;
}

export class ContactBillUtils {
  /**
   * Find all bills where a contact is involved (as owner or participant)
   */
  static getBillsWithContact(bills: Bill[], contactId: string): Bill[] {
    return bills.filter(bill => 
      bill.owner.user.id === contactId || 
      bill.participants.some(p => p.user.id === contactId)
    );
  }

  /**
   * Calculate statistics for a contact based on their bill history
   */
  static calculateContactStats(
    bills: Bill[], 
    contactId: string, 
    currentUserId: string
  ): ContactStats {
    const contactBills = this.getBillsWithContact(bills, contactId);
    const activeBills = contactBills.filter(bill => bill.status === 'pending');
    
    let totalAmountInvolved = 0;
    let balanceOwedToYou = 0;
    let balanceYouOwe = 0;
    let lastBillDate: string | undefined;

    contactBills.forEach(bill => {
      const isContactOwner = bill.owner.user.id === contactId;
      const isCurrentUserOwner = bill.owner.user.id === currentUserId;
      
      // Update last bill date
      if (!lastBillDate || new Date(bill.creationDate) > new Date(lastBillDate)) {
        lastBillDate = bill.creationDate;
      }

      if (isContactOwner) {
        // Contact is the owner, you are a participant
        const yourParticipation = bill.participants.find(p => p.user.id === currentUserId);
        if (yourParticipation) {
          totalAmountInvolved += yourParticipation.amountToPay;
          if (bill.status === 'pending') {
            balanceYouOwe += yourParticipation.amountToPay;
          }
        }
      } else if (isCurrentUserOwner) {
        // You are the owner, contact is a participant
        const contactParticipation = bill.participants.find(p => p.user.id === contactId);
        if (contactParticipation) {
          totalAmountInvolved += contactParticipation.amountToPay;
          if (bill.status === 'pending') {
            balanceOwedToYou += contactParticipation.amountToPay;
          }
        }
      } else {
        // Both are participants (another person is the owner)
        const contactParticipation = bill.participants.find(p => p.user.id === contactId);
        const yourParticipation = bill.participants.find(p => p.user.id === currentUserId);
        
        if (contactParticipation && yourParticipation) {
          // Calculate the shared portion between you two
          const sharedAmount = Math.abs(contactParticipation.amountToPay - yourParticipation.amountToPay);
          totalAmountInvolved += sharedAmount;
        }
      }
    });

    const netBalance = balanceOwedToYou - balanceYouOwe;
    const averageBillAmount = contactBills.length > 0 ? totalAmountInvolved / contactBills.length : 0;

    return {
      totalBills: contactBills.length,
      activeBills: activeBills.length,
      totalAmountInvolved,
      balanceOwedToYou,
      balanceYouOwe,
      netBalance,
      lastBillDate,
      averageBillAmount,
    };
  }

  /**
   * Get contact with calculated statistics
   */
  static getContactWithStats(
    contact: Contact, 
    bills: Bill[], 
    currentUserId: string
  ): ContactWithStats {
    const stats = this.calculateContactStats(bills, contact.id, currentUserId);
    return {
      ...contact,
      stats,
    };
  }

  /**
   * Get all contacts with their statistics
   */
  static getContactsWithStats(
    contacts: Contact[], 
    bills: Bill[], 
    currentUserId: string
  ): ContactWithStats[] {
    return contacts.map(contact => 
      this.getContactWithStats(contact, bills, currentUserId)
    );
  }

  /**
   * Get relationships between a contact and all bills
   */
  static getContactBillRelationships(
    bills: Bill[], 
    contactId: string, 
    currentUserId: string
  ): ContactBillRelationship[] {
    return this.getBillsWithContact(bills, contactId).map(bill => {
      const isContactOwner = bill.owner.user.id === contactId;
      const isCurrentUserOwner = bill.owner.user.id === currentUserId;
      
      let amountOwed = 0;
      let amountTheyOwe = 0;

      if (isContactOwner) {
        // Contact owns the bill, you might owe them
        const yourParticipation = bill.participants.find(p => p.user.id === currentUserId);
        if (yourParticipation) {
          amountTheyOwe = yourParticipation.amountToPay;
        }
      } else if (isCurrentUserOwner) {
        // You own the bill, contact might owe you
        const contactParticipation = bill.participants.find(p => p.user.id === contactId);
        if (contactParticipation) {
          amountOwed = contactParticipation.amountToPay;
        }
      }

      return {
        contactId,
        billId: bill.id,
        amountOwed,
        amountTheyOwe,
        isOwner: isContactOwner,
        isParticipant: !isContactOwner,
        billStatus: bill.status,
        billDate: bill.creationDate,
      };
    });
  }

  /**
   * Filter contacts by balance status
   */
  static filterContactsByBalance(
    contactsWithStats: ContactWithStats[],
    filter: 'owes-you' | 'you-owe' | 'settled' | 'active' | 'all'
  ): ContactWithStats[] {
    switch (filter) {
      case 'owes-you':
        return contactsWithStats.filter(c => c.stats.netBalance > 0);
      case 'you-owe':
        return contactsWithStats.filter(c => c.stats.netBalance < 0);
      case 'settled':
        return contactsWithStats.filter(c => c.stats.netBalance === 0 && c.stats.totalBills > 0);
      case 'active':
        return contactsWithStats.filter(c => c.stats.activeBills > 0);
      case 'all':
      default:
        return contactsWithStats;
    }
  }

  /**
   * Sort contacts by various criteria
   */
  static sortContacts(
    contactsWithStats: ContactWithStats[],
    sortBy: 'name' | 'balance' | 'activity' | 'bills-count' | 'recent'
  ): ContactWithStats[] {
    const sorted = [...contactsWithStats];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
      case 'balance':
        return sorted.sort((a, b) => Math.abs(b.stats.netBalance) - Math.abs(a.stats.netBalance));
      case 'activity':
        return sorted.sort((a, b) => {
          if (!a.stats.lastBillDate && !b.stats.lastBillDate) return 0;
          if (!a.stats.lastBillDate) return 1;
          if (!b.stats.lastBillDate) return -1;
          return new Date(b.stats.lastBillDate).getTime() - new Date(a.stats.lastBillDate).getTime();
        });
      case 'bills-count':
        return sorted.sort((a, b) => b.stats.totalBills - a.stats.totalBills);
      case 'recent':
        return sorted.sort((a, b) => {
          if (!a.lastActivityAt && !b.lastActivityAt) return 0;
          if (!a.lastActivityAt) return 1;
          if (!b.lastActivityAt) return -1;
          return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
        });
      default:
        return sorted;
    }
  }

  /**
   * Get frequently used contacts (by bill count)
   */
  static getFrequentContacts(
    contactsWithStats: ContactWithStats[],
    limit: number = 5
  ): ContactWithStats[] {
    return this.sortContacts(contactsWithStats, 'bills-count')
      .filter(c => c.stats.totalBills > 0)
      .slice(0, limit);
  }

  /**
   * Get recent contacts (by last activity)
   */
  static getRecentContacts(
    contactsWithStats: ContactWithStats[],
    limit: number = 5
  ): ContactWithStats[] {
    return this.sortContacts(contactsWithStats, 'recent')
      .filter(c => c.lastActivityAt)
      .slice(0, limit);
  }
}
