import { create } from "zustand";
import axios from "axios";
import { API_URL as API } from "../services/api";

/**
 * Zustand Store for Global Authentication State.
 * Manages user session, login, logout, and session verification via httpOnly cookies.
 */
export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  /**
   * Verify Session on Page Load
   * Checks if the JWT cookie is still valid by making a request to the backend.
   * If successful, sets the current user in state. If it fails (e.g., expired token),
   * clears the auth state.
   */
  verifySession: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(
        `${API}/user-api/verify`,
        { withCredentials: true } // Required to send the httpOnly cookie to the backend
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload
      });

      return true;
    } catch {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null
      });

      return false;
    }
  },

  /**
   * Authenticate User
   * Submits credentials to the backend. On success, the backend sets an httpOnly cookie
   * and returns the user object, which is then stored in the global state.
   */
  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null });

      let res = await axios.post(
        `${API}/user-api/signin`,
        userCredObj,
        { withCredentials: true }
      );

      const data = res.data;

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: data.payload
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || err.response?.data?.error || "Login failed"
      });
    }
  },

  /**
   * Log User Out
   * Instructs the backend to clear the httpOnly cookie.
   * Clears the local Zustand state regardless of whether the API call succeeds or fails.
   */
  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.post(
        `${API}/user-api/logout`,
        {},
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null
      });

    } catch (err) {
      // Even if logout API fails (e.g. network issue), clear local state to prevent being stuck
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed"
      });
    }
  },

  /**
   * Clear Auth State (Emergency fallback)
   * Automatically called by Axios interceptors if a 401 Unauthorized response is detected 
   * on any authenticated route.
   */
  clearAuth: () => {
    set({
      loading: false,
      isAuthenticated: false,
      currentUser: null,
      error: null
    });
  }
}));