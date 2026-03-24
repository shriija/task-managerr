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

      const res = await axios.post(
        `${API_URL}/user-api/signup`,
        payload
      );

      console.log(res.data);
      toast.success("Account created successfully!");
      navigate("/login");

    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 select-none">

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 w-102">
          <h2 className="text-2xl font-bold mb-6 text-center"> Register </h2>

          {/* Server error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Name </label>
            <input type="text" className="w-full border rounded p-2" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Email </label>
            <input type="text" className="w-full border rounded p-2" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Password </label>
            <input type="password" className="w-full border rounded p-2" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Profile Picture </label>
            <div className="flex gap-2">
              <input type="url" placeholder="Enter image URL" className="w-3/4 border rounded p-2" {...register("profileImageUrl")} />
            </div>
          </div>

          <div className="flex items-center mb-3">
            <input id="terms" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the <a href="#" className="text-primary-600 hover:text-primary-500">Terms</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-1">
            Already have an account?{' '}
            <NavLink to="/login" className="font-semibold text-gray-900 hover:text-gray-700">
              Log in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage