import { create } from "zustand"
import axios from "axios"

// 🔹 Load saved user from localStorage
const savedUser = JSON.parse(localStorage.getItem("user"))

export const useAuthStore = create((set) => ({
  currentUser: savedUser || null,
  loading: false,
  isAuthenticated: !!savedUser,
  error: null,

  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null })

      let res = await axios.post(
        "http://localhost:4001/user-api/signin",
        userCredObj,
        { withCredentials: true }
      )

      const data = res.data

      // 🔹 Save to localStorage
      localStorage.setItem("user", JSON.stringify(data.payload))

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
        error: err.response?.data?.error || "Login failed"
      })
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null })

      await axios.get(
        "http://localhost:4001/user-api/logout",
        { withCredentials: true }
      )

      // 🔹 Remove saved user
      localStorage.removeItem("user")

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null
      })

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Logout failed"
      })
    }
  }
}))