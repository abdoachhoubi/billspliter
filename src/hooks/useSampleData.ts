import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setBills } from '../store/slices/billsSlice';
import { setContacts } from '../store/slices/contactsSlice';
import { selectAllBills } from '../store/selectors/billsSelectors';
import { selectContacts } from '../store/selectors/contactsSelectors';
import { sampleBills, sampleContacts } from '../utils/sampleData';

export const useSampleData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const existingBills = useSelector(selectAllBills);
  const existingContacts = useSelector(selectContacts);

  useEffect(() => {
    // Only load sample data if there are no existing bills/contacts
    if (existingBills.length === 0) {
      dispatch(setBills(sampleBills));
    }
    
    if (existingContacts.length === 0) {
      dispatch(setContacts(sampleContacts));
    }
  }, [dispatch, existingBills.length, existingContacts.length]);
};
