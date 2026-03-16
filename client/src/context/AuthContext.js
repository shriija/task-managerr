import { create } from "zustand"
import axios from "axios"

export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
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

  	  set({
    	  loading:false,
	      isAuthenticated:true,
  	    currentUser:data.payload
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
        "http://localhost:3000/common-api/logout",
        { withCredentials: true }
      )

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