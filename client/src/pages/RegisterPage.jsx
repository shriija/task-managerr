import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import axios from 'axios'
import { API_URL } from "../services/api"
import toast from 'react-hot-toast'

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (newUser) => {
    try {
      setLoading(true);
      setError(null);

      // Map profileImageUrl → avatar to match the server User model
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        avatar: newUser.profileImageUrl || ""
      };

      await axios.post(
        `${API_URL}/user-api/signup`,
        payload
      );

      toast.success("Account created successfully!");
      navigate("/login");

    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 select-none p-6 font-body">
      <div className="bg-white border border-slate-200/80 shadow-xl shadow-slate-100 rounded-2xl p-8 max-w-md w-full">
        
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-slate-500 text-sm">Get started with your free Kanvas workspace.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Server Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl text-center">
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="text" 
              placeholder="name@example.com" 
              {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Picture URL (Optional)</label>
            <input 
              type="url" 
              placeholder="https://example.com/avatar.jpg" 
              {...register("profileImageUrl")} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start">
            <input 
              id="terms" 
              type="checkbox" 
              required 
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer mt-0.5" 
            />
            <label htmlFor="terms" className="ml-2.5 text-xs text-slate-500 leading-normal cursor-pointer">
              I agree to the <a href="#" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Terms of Service</a> and <a href="#" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md shadow-primary-500/10 focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Redirect */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <NavLink to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Log in
            </NavLink>
          </p>
        </form>

      </div>
    </div>
  );
}

export default RegisterPage