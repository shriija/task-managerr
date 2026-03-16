import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink,useNavigate } from "react-router";
import axios from 'axios'

function RegisterPage() {
const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);  

  const onSubmit = async (newUser) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        "http://localhost:4001/user-api/signup",
        newUser
      );

      console.log(res.data);
      alert("User registered successfully");

    } catch (err) {
      console.log(err)
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 select-none">

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-8 w-102">
          <h2 className="text-2xl font-bold mb-6 text-center"> Register </h2>
          <div className="mb-4">
            {

            }
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Name </label>
            <input type="text" className="w-full border rounded p-2" {...register("name", { required:true, minLength:2})} />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Email </label>
            <input type="text" className="w-full border rounded p-2" {...register("email", { required:true, pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/})} />
            {

            }
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Password </label>
            <input type="password" className="w-full border rounded p-2" {...register("password", { required:true, minLength:6 })} />
						{

						}
          </div>
          {/* Profile Picture */}
          <div className="mb-4">
            <label className="block mb-1 font-medium"> Profile Picture </label>

            <div className="flex gap-2">
              {/* Image URL */}
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
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Account
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