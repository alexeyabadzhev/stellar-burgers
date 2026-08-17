import { TOrder } from './../../utils/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';

interface FeedStateProps {
  orders: TOrder[];
  totalOrders: number;
  totalToday: number;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: FeedStateProps = {
  orders: [],
  totalOrders: 0,
  totalToday: 0,
  isLoading: false,
  error: undefined
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () =>
  getFeedsApi()
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotalOrders: (state) => state.totalOrders,
    selectFeedTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { selectFeedOrders, selectFeedTotalOrders, selectFeedTotalToday } =
  feedSlice.selectors;

export default feedSlice.reducer;
