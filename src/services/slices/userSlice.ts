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
  isAuthChecked: boolean;
  loginError: string | undefined;
  registerError: string | undefined;
  updateError: string | undefined;
}

const initialState: UserStateProps = {
  user: null,
  isAuthChecked: false,
  loginError: undefined,
  registerError: undefined,
  updateError: undefined
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
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectLoginError: (state) => state.loginError,
    selectRegisterError: (state) => state.registerError,
    selectUpdateError: (state) => state.updateError
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuthorization.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuthorization.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(checkUserAuthorization.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateError = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateError = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectLoginError,
  selectRegisterError,
  selectUpdateError
} = userSlice.selectors;
export default userSlice.reducer;
