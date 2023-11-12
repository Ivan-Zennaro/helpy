import { configureStore } from '@reduxjs/toolkit';
import  { accountSlice } from './features/accountSlice';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    // Add more slices here if needed
  },
});

export const useAppDispatch:() => typeof store.dispatch = useDispatch;
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

export default store;