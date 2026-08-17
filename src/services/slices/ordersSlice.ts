import { TOrder } from './../../utils/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';

interface OrdersStateProps {
  orders: TOrder[];
  isLoading: boolean;
  error: string | undefined;
}

const initialState: OrdersStateProps = {
  orders: [],
  isLoading: false,
  error: undefined
};

export const getOrders = createAsyncThunk('orders/getOrders', async () =>
  getOrdersApi()
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      });
  }
});

export const { selectOrders } = ordersSlice.selectors;

export default ordersSlice.reducer;
