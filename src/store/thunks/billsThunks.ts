import { createAsyncThunk } from '@reduxjs/toolkit';
import { Bill, CreateBillRequest, BillUtils, BillParticipant, BillOwner } from '../../common/entities/bill.entity';
import { Contact } from '../../common/entities/contact.entity';
import { setLoading, setError, addBill, updateBill, deleteBill, updateBillStatus } from '../slices/billsSlice';

// Generate unique ID (in a real app, you might want to use a more robust solution)
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Convert Contact to BillParticipant user structure
const contactToBillUser = (contact: Contact) => ({
  id: contact.id,
  firstName: contact.firstName,
  lastName: contact.lastName,
  email: contact.email,
  avatar: contact.profileImage,
});

// Create a new bill
export const createBill = createAsyncThunk(
  'bills/create',
  async (
    billData: {
      title: string;
      description?: string;
      totalAmount: number;
      splitType: 'percentage' | 'amount';
      participants: { contact: Contact; amount: number }[];
      owner: Contact; // The person creating the bill
    },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const billId = generateId();
      const currentDate = new Date();

      // Calculate owner's split based on remaining amount/percentage
      let ownerSplitValue = 0;
      if (billData.splitType === 'percentage') {
        const participantsTotalPercentage = billData.participants.reduce((sum, p) => sum + p.amount, 0);
        ownerSplitValue = Math.max(0, 100 - participantsTotalPercentage); // Remaining percentage
      } else {
        const participantsTotalAmount = billData.participants.reduce((sum, p) => sum + p.amount, 0);
        ownerSplitValue = Math.max(0, billData.totalAmount - participantsTotalAmount); // Remaining amount
      }

      // Create owner from contact
      const owner: BillOwner = {
        user: contactToBillUser(billData.owner),
        splitValue: ownerSplitValue,
        amountToPay: 0, // Will be calculated
      };

      // Create participants from contacts
      const participants: BillParticipant[] = billData.participants.map(p => ({
        user: contactToBillUser(p.contact),
        splitValue: p.amount,
        amountToPay: 0, // Will be calculated
      }));

      // Calculate amounts to pay
      const { updatedParticipants, updatedOwner } = BillUtils.calculateAmountsToPay(
        participants,
        owner,
        billData.totalAmount,
        billData.splitType
      );

      // Create the bill
      const newBill: Bill = {
        id: billId,
        title: billData.title,
        totalAmount: billData.totalAmount,
        splitType: billData.splitType,
        owner: updatedOwner,
        participants: updatedParticipants,
        creationDate: currentDate,
        lastModified: currentDate,
        status: 'pending',
        description: billData.description,
      };

      // Validate the bill
      const validationErrors = BillUtils.validateBill(newBill);
      if (validationErrors.length > 0) {
        throw new Error(`Bill validation failed: ${validationErrors.join(', ')}`);
      }

      // Add to store
      dispatch(addBill(newBill));
      
      return newBill;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create bill';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Update an existing bill
export const updateExistingBill = createAsyncThunk(
  'bills/update',
  async (
    updates: {
      id: string;
      title?: string;
      description?: string;
      totalAmount?: number;
      splitType?: 'percentage' | 'amount';
      participants?: { contact: Contact; amount: number }[];
    },
    { dispatch, getState }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const state = getState() as any;
      const existingBill = state.bills.bills.find((bill: Bill) => bill.id === updates.id);
      
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      // Create updated bill
      let updatedBill = { ...existingBill };

      if (updates.title !== undefined) updatedBill.title = updates.title;
      if (updates.description !== undefined) updatedBill.description = updates.description;
      if (updates.totalAmount !== undefined) updatedBill.totalAmount = updates.totalAmount;
      if (updates.splitType !== undefined) updatedBill.splitType = updates.splitType;

      if (updates.participants) {
        const participants: BillParticipant[] = updates.participants.map(p => ({
          user: contactToBillUser(p.contact),
          splitValue: p.amount,
          amountToPay: 0,
        }));

        const { updatedParticipants, updatedOwner } = BillUtils.calculateAmountsToPay(
          participants,
          updatedBill.owner,
          updatedBill.totalAmount,
          updatedBill.splitType
        );

        updatedBill.participants = updatedParticipants;
        updatedBill.owner = updatedOwner;
      }

      updatedBill.lastModified = new Date();

      // Validate the updated bill
      const validationErrors = BillUtils.validateBill(updatedBill);
      if (validationErrors.length > 0) {
        throw new Error(`Bill validation failed: ${validationErrors.join(', ')}`);
      }

      dispatch(updateBill(updatedBill));
      
      return updatedBill;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update bill';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Delete a bill
export const deleteBillById = createAsyncThunk(
  'bills/delete',
  async (billId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      dispatch(deleteBill(billId));
      
      return billId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete bill';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Update bill status (paid, cancelled, etc.)
export const updateBillStatusById = createAsyncThunk(
  'bills/updateStatus',
  async (
    { billId, status }: { billId: string; status: 'pending' | 'paid' | 'cancelled' },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      dispatch(updateBillStatus({ id: billId, status }));
      
      return { billId, status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update bill status';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
