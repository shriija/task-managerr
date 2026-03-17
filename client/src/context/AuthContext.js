import { create } from "zustand"
import axios from "axios"
import { API_URL as API } from "../services/api"

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  // Verify session on page load — checks if JWT cookie is still valid
  verifySession: async () => {
    try {
      set({ loading: true, error: null })

      const res = await axios.get(
        `${API}/user-api/verify`,
        { withCredentials: true }
      )

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload
      })

      return true

    } catch {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null
      })

      return false
    }
  },

  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null })

      let res = await axios.post(
        `${API}/user-api/signin`,
        userCredObj,
        { withCredentials: true }
      )

      const data = res.data

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: data.payload
      })

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || err.response?.data?.error || "Login failed"
      })
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null })

      await axios.get(
        `${API}/user-api/logout`,
        { withCredentials: true }
      )

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null
      })

    } catch (err) {
      // Even if logout API fails, clear local state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed"
      })
    }
  },

  // Clear auth state (called when 401 is detected)
  clearAuth: () => {
    set({
      loading: false,
      isAuthenticated: false,
      currentUser: null,
      error: null
    })
  }
}))