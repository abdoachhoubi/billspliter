import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill, CreateBillRequest } from '../../common/entities/bill.entity';

export interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

const initialState: BillsState = {
  bills: [],
  loading: false,
  error: null,
  lastUpdated: 0,
};

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },

    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.unshift(action.payload); // Add to beginning for recent first
      state.lastUpdated = Date.now();
      state.error = null;
    },

    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(
        bill => bill.id === action.payload.id
      );
      if (index !== -1) {
        state.bills[index] = {
          ...state.bills[index],
          ...action.payload,
          lastModified: new Date().toISOString(),
        };
        state.lastUpdated = Date.now();
      }
    },

    deleteBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(bill => bill.id !== action.payload);
      state.lastUpdated = Date.now();
      state.error = null;
    },

    updateBillStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: 'pending' | 'paid' | 'cancelled';
      }>
    ) => {
      const index = state.bills.findIndex(
        bill => bill.id === action.payload.id
      );
      if (index !== -1) {
        state.bills[index].status = action.payload.status;
        state.bills[index].lastModified = new Date().toISOString();
        state.lastUpdated = Date.now();
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: state => {
      state.error = null;
    },

    clearBills: state => {
      state.bills = [];
      state.lastUpdated = Date.now();
      state.error = null;
    },
  },
});

export const {
  setBills,
  addBill,
  updateBill,
  deleteBill,
  updateBillStatus,
  setLoading,
  setError,
  clearError,
  clearBills,
} = billsSlice.actions;

export default billsSlice.reducer;
