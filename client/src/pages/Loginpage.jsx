import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../context/AuthContext";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

/**
 * Loginpage Component
 * 
 * Handles user authentication by collecting email and password.
 * Uses `react-hook-form` for form state management and validation.
 * Upon successful login, redirects the user to the dashboard.
 */
function Loginpage() {
  // Initialize form controls from react-hook-form
  const { register, handleSubmit } = useForm();
  
  // Local state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Selectors from the global AuthStore Zustand context
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const navigate = useNavigate();

  /**
   * Form submission handler.
   * Dispatches the login action with the collected credentials.
   * If successful and the user becomes authenticated, redirects to the dashboard.
   * 
   * @param {Object} userCredObj - An object containing `email` and `password`.
   */
  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
    // After login attempt, check the latest state to see if it was successful
    if (useAuthStore.getState().isAuthenticated) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 select-none p-6 font-body">
      <div className="bg-white border border-slate-200/80 shadow-xl shadow-slate-100 rounded-2xl p-8 max-w-md w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Enter your credentials to access your workspace.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-5">
          
          {/* Global Server Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl text-center">
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          {/* Email Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              {...register("email", { required: true })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Password Input Field with Toggle Visibility */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                {...register("password", { required: true })} 
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
              {/* Password Visibility Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  // Eye-slash icon (hide password)
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md shadow-primary-500/10 focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* OR Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                await googleLogin(credentialResponse.credential);
                if (useAuthStore.getState().isAuthenticated) {
                  navigate("/dashboard");
                }
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          {/* Redirect */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign up for free
            </NavLink>
          </p>
        </form>

      </div>
    </div>
  )
}

export default Loginpage