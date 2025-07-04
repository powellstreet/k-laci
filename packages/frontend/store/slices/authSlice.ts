import { StateCreator } from 'zustand';
import { AuthState, User } from '../types/auth';

export interface AuthSlice {
  auth: AuthState;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, access_token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  access_token: null,
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  auth: initialState,
  
  setIsLoggedIn: (isLoggedIn: boolean) => {
    set((state) => ({
      auth: {
        ...state.auth,
        isLoggedIn,
      },
    }));
  },

  setUser: (user: User | null) => {
    set((state) => ({
      auth: {
        ...state.auth,
        user,
      },
    }));
  },

  setAccessToken: (access_token: string | null) => {
    set((state) => ({
      auth: {
        ...state.auth,
        access_token,
      },
    }));
  },

  login: (user: User, access_token: string) => {
    set((state) => ({
      auth: {
        ...state.auth,
        isLoggedIn: true,
        user,
        access_token,
      },
    }));
  },

  logout: () => {
    set((state) => ({
      auth: {
        ...state.auth,
        isLoggedIn: false,
        user: null,
        access_token: null,
      },
    }));
  },
}); 

