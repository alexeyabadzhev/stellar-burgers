import {
  TLoginData,
  TRegisterData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from './../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

interface UserStateProps {
  user: TUser | null;
  isAuthorized: boolean;
  error: string | undefined;
}

const initialState: UserStateProps = {
  user: null,
  isAuthorized: false,
  error: undefined
};

export const checkUserAuthorization = createAsyncThunk<TUser | null>(
  'user/checkAuthorization',
  async () => {
    if (!getCookie('accessToken')) return null;
    const userData = await getUserApi();
    return userData.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/loginUser',
  async (data) => {
    const res = loginUserApi(data);
    localStorage.setItem('refreshToken', (await res).refreshToken);
    setCookie('accessToken', (await res).accessToken);
    return (await res).user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  async (data) => {
    const res = registerUserApi(data);
    localStorage.setItem('refreshToken', (await res).refreshToken);
    setCookie('accessToken', (await res).accessToken);
    return (await res).user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data) => {
    const res = updateUserApi(data);
    return (await res).user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthorized: (state) => state.isAuthorized,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuthorization.pending, (state) => {
        state.isAuthorized = false;
      })
      .addCase(checkUserAuthorization.rejected, (state, action) => {
        state.isAuthorized = true;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(checkUserAuthorization.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthorized = false;
      });
  }
});

export const { selectUser, selectIsAuthorized, selectError } =
  userSlice.selectors;
export default userSlice.reducer;
