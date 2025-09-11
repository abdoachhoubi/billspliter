export type SplitType = 'percentage' | 'amount';

export interface BillParticipant {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  splitValue: number; // This will be either percentage (0-100) or amount based on splitType
  amountToPay: number; // Calculated amount this participant needs to pay
}

export interface BillOwner extends BillParticipant {
  // Owner inherits all participant properties
  // but represents the person who created and owns the bill
}

export interface Bill {
  id: string;
  title: string;
  totalAmount: number;
  splitType: SplitType;
  owner: BillOwner;
  participants: BillParticipant[]; // Other participants (excluding owner)
  creationDate: Date;
  lastModified: Date;
  status: 'pending' | 'paid' | 'cancelled';
  description?: string;
  // category will be added later when category system is implemented
  categoryId?: string;
}

export interface CreateBillRequest {
  title: string;
  totalAmount: number;
  splitType: SplitType;
  participants: {
    userId: string;
    splitValue: number;
  }[];
  description?: string;
  categoryId?: string;
}

export class BillUtils {
  /**
   * Validates that percentage splits add up to 100%
   */
  static validatePercentageSplits(participants: BillParticipant[], owner: BillOwner): boolean {
    if (participants.length === 0) return owner.splitValue === 100;
    
    const totalPercentage = participants.reduce((sum, p) => sum + p.splitValue, 0) + owner.splitValue;
    return Math.abs(totalPercentage - 100) < 0.01; // Allow for small floating point errors
  }

  /**
   * Validates that amount splits don't exceed total bill amount
   */
  static validateAmountSplits(
    participants: BillParticipant[], 
    owner: BillOwner, 
    totalAmount: number
  ): boolean {
    const totalSplitAmount = participants.reduce((sum, p) => sum + p.splitValue, 0) + owner.splitValue;
    return totalSplitAmount <= totalAmount;
  }

  /**
   * Calculates amount to pay for each participant based on split type
   */
  static calculateAmountsToPay(
    participants: BillParticipant[],
    owner: BillOwner,
    totalAmount: number,
    splitType: SplitType
  ): { updatedParticipants: BillParticipant[]; updatedOwner: BillOwner } {
    if (splitType === 'percentage') {
      const updatedParticipants = participants.map(p => ({
        ...p,
        amountToPay: (p.splitValue / 100) * totalAmount
      }));
      
      const updatedOwner = {
        ...owner,
        amountToPay: (owner.splitValue / 100) * totalAmount
      };

      return { updatedParticipants, updatedOwner };
    } else {
      // For amount splits, splitValue is already the amount to pay
      const updatedParticipants = participants.map(p => ({
        ...p,
        amountToPay: p.splitValue
      }));
      
      const updatedOwner = {
        ...owner,
        amountToPay: owner.splitValue
      };

      return { updatedParticipants, updatedOwner };
    }
  }

  /**
   * Gets all participants including owner
   */
  static getAllParticipants(bill: Bill): BillParticipant[] {
    return [bill.owner, ...bill.participants];
  }

  /**
   * Calculates remaining amount for amount-based splits
   */
  static getRemainingAmount(
    participants: BillParticipant[],
    owner: BillOwner,
    totalAmount: number
  ): number {
    const allocatedAmount = participants.reduce((sum, p) => sum + p.splitValue, 0) + owner.splitValue;
    return totalAmount - allocatedAmount;
  }

  /**
   * Formats bill amount for display
   */
  static formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Gets display name for a participant
   */
  static getParticipantDisplayName(participant: BillParticipant): string {
    return `${participant.user.firstName} ${participant.user.lastName}`.trim();
  }

  /**
   * Validates bill data before creation
   */
  static validateBill(bill: Partial<Bill>): string[] {
    const errors: string[] = [];

    if (!bill.title?.trim()) {
      errors.push('Bill title is required');
    }

    if (!bill.totalAmount || bill.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    if (!bill.splitType) {
      errors.push('Split type is required');
    }

    if (!bill.owner) {
      errors.push('Bill owner is required');
    }

    if (!bill.participants || bill.participants.length === 0) {
      errors.push('At least one participant is required');
    }

    if (bill.splitType === 'percentage' && bill.owner && bill.participants) {
      if (!this.validatePercentageSplits(bill.participants, bill.owner)) {
        errors.push('Percentage splits must add up to 100%');
      }
    }

    if (bill.splitType === 'amount' && bill.owner && bill.participants && bill.totalAmount) {
      if (!this.validateAmountSplits(bill.participants, bill.owner, bill.totalAmount)) {
        errors.push('Amount splits cannot exceed total bill amount');
      }
    }

    return errors;
  }
}
