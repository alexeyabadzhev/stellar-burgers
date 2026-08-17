import { getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk, isAction } from '@reduxjs/toolkit';
import { TOrder } from './../../utils/types';

interface OrderByNumberProps {
  order: TOrder | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: OrderByNumberProps = {
  order: null,
  isLoading: false,
  error: undefined
};

export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/getOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

export const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  selectors: {
    selectOrderByNumber: (state) => state.order,
    selectOrderByNumberLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      });
  }
});

export const { selectOrderByNumber, selectOrderByNumberLoading } =
  orderByNumberSlice.selectors;

export default orderByNumberSlice.reducer;
