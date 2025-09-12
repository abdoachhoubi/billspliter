import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Bill } from '../../common/entities/bill.entity';

// Base selector
const selectBillsState = (state: RootState) => state.bills;

// Basic selectors
export const selectAllBills = createSelector(
  [selectBillsState],
  billsState => billsState.bills
);

export const selectBillsLoading = createSelector(
  [selectBillsState],
  billsState => billsState.loading
);

export const selectBillsError = createSelector(
  [selectBillsState],
  billsState => billsState.error
);

export const selectBillsLastUpdated = createSelector(
  [selectBillsState],
  billsState => billsState.lastUpdated
);

// Get bill by ID
export const selectBillById = createSelector(
  [selectAllBills, (state: RootState, billId: string) => billId],
  (bills: Bill[], billId: string) =>
    bills.find((bill: Bill) => bill.id === billId)
);

// Get bills by status
export const selectBillsByStatus = createSelector(
  [
    selectAllBills,
    (state: RootState, status: 'pending' | 'paid' | 'cancelled') => status,
  ],
  (bills: Bill[], status: 'pending' | 'paid' | 'cancelled') =>
    bills.filter((bill: Bill) => bill.status === status)
);

// Get pending bills
export const selectPendingBills = createSelector(
  [selectAllBills],
  (bills: Bill[]) => bills.filter((bill: Bill) => bill.status === 'pending')
);

// Get paid bills
export const selectPaidBills = createSelector(
  [selectAllBills],
  (bills: Bill[]) => bills.filter((bill: Bill) => bill.status === 'paid')
);

// Get cancelled bills
export const selectCancelledBills = createSelector(
  [selectAllBills],
  (bills: Bill[]) => bills.filter((bill: Bill) => bill.status === 'cancelled')
);

// Get bills by owner
export const selectBillsByOwner = createSelector(
  [selectAllBills, (state: RootState, ownerId: string) => ownerId],
  (bills: Bill[], ownerId: string) =>
    bills.filter((bill: Bill) => bill.owner.user.id === ownerId)
);

// Get bills where user is a participant (including as owner)
export const selectBillsByParticipant = createSelector(
  [selectAllBills, (state: RootState, userId: string) => userId],
  (bills: Bill[], userId: string) =>
    bills.filter(
      (bill: Bill) =>
        bill.owner.user.id === userId ||
        bill.participants.some(participant => participant.user.id === userId)
    )
);

// Get recent bills (last 30 days)
export const selectRecentBills = createSelector(
  [selectAllBills],
  (bills: Bill[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return bills
      .filter((bill: Bill) => new Date(bill.creationDate) >= thirtyDaysAgo)
      .sort(
        (a: Bill, b: Bill) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      );
  }
);

// Get bills sorted by creation date (newest first)
export const selectBillsSortedByDate = createSelector(
  [selectAllBills],
  (bills: Bill[]) =>
    [...bills].sort(
      (a: Bill, b: Bill) =>
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    )
);

// Get bills sorted by amount (highest first)
export const selectBillsSortedByAmount = createSelector(
  [selectAllBills],
  (bills: Bill[]) =>
    [...bills].sort((a: Bill, b: Bill) => b.totalAmount - a.totalAmount)
);

// Statistics selectors
export const selectBillsStats = createSelector(
  [selectAllBills],
  (bills: Bill[]) => {
    const totalBills = bills.length;
    const pendingBills = bills.filter(
      (bill: Bill) => bill.status === 'pending'
    ).length;
    const paidBills = bills.filter(
      (bill: Bill) => bill.status === 'paid'
    ).length;
    const cancelledBills = bills.filter(
      (bill: Bill) => bill.status === 'cancelled'
    ).length;

    const totalAmount = bills.reduce(
      (sum: number, bill: Bill) => sum + bill.totalAmount,
      0
    );
    const pendingAmount = bills
      .filter((bill: Bill) => bill.status === 'pending')
      .reduce((sum: number, bill: Bill) => sum + bill.totalAmount, 0);
    const paidAmount = bills
      .filter((bill: Bill) => bill.status === 'paid')
      .reduce((sum: number, bill: Bill) => sum + bill.totalAmount, 0);

    return {
      totalBills,
      pendingBills,
      paidBills,
      cancelledBills,
      totalAmount,
      pendingAmount,
      paidAmount,
      averageAmount: totalBills > 0 ? totalAmount / totalBills : 0,
    };
  }
);

// Get user-specific statistics
export const selectUserBillsStats = createSelector(
  [selectAllBills, (state: RootState, userId: string) => userId],
  (bills: Bill[], userId: string) => {
    const userBills = bills.filter(
      (bill: Bill) =>
        bill.owner.user.id === userId ||
        bill.participants.some(participant => participant.user.id === userId)
    );

    const ownedBills = bills.filter(
      (bill: Bill) => bill.owner.user.id === userId
    );
    const participatedBills = bills.filter((bill: Bill) =>
      bill.participants.some(participant => participant.user.id === userId)
    );

    // Calculate amounts owed to user (bills they own where others owe them)
    const amountOwedToUser = ownedBills.reduce((sum: number, bill: Bill) => {
      const participantsAmount = bill.participants.reduce(
        (partSum: number, participant) => partSum + participant.amountToPay,
        0
      );
      return sum + participantsAmount;
    }, 0);

    // Calculate amounts user owes (bills they participate in but don't own)
    const amountUserOwes = participatedBills.reduce(
      (sum: number, bill: Bill) => {
        const userParticipant = bill.participants.find(
          p => p.user.id === userId
        );
        return sum + (userParticipant?.amountToPay || 0);
      },
      0
    );

    return {
      totalBills: userBills.length,
      ownedBills: ownedBills.length,
      participatedBills: participatedBills.length,
      amountOwedToUser,
      amountUserOwes,
      netBalance: amountOwedToUser - amountUserOwes,
    };
  }
);

// Search bills by title or description
export const selectBillsBySearch = createSelector(
  [selectAllBills, (state: RootState, searchTerm: string) => searchTerm],
  (bills: Bill[], searchTerm: string) => {
    if (!searchTerm.trim()) return bills;

    const lowercaseSearch = searchTerm.toLowerCase();
    return bills.filter(
      (bill: Bill) =>
        bill.title.toLowerCase().includes(lowercaseSearch) ||
        (bill.description &&
          bill.description.toLowerCase().includes(lowercaseSearch))
    );
  }
);
