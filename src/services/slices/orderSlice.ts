import { TOrder } from './../../utils/types';
import { orderBurgerApi } from './../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface OrderStateProps {
  request: boolean;
  modalData: TOrder | null;
  error: string | undefined;
}

const initialState: OrderStateProps = {
  request: false,
  modalData: null,
  error: undefined
};

export const burgerOrder = createAsyncThunk<TOrder, string[]>(
  'order/burgerOrder',
  async (ids) => {
    const res = await orderBurgerApi(ids);
    return { ...res.order, ingredients: ids };
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.modalData = null;
      state.error = undefined;
    }
  },
  selectors: {
    selectRequest: (state) => state.request,
    selectModalData: (state) => state.modalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(burgerOrder.pending, (state) => {
        state.request = true;
        state.error = undefined;
      })
      .addCase(burgerOrder.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message;
      })
      .addCase(burgerOrder.fulfilled, (state, action) => {
        state.modalData = action.payload;
        state.request = false;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export const { selectRequest, selectModalData } = orderSlice.selectors;

export default orderSlice.reducer;
