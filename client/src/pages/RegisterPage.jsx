import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink,useNavigate } from "react-router";
import axios from 'axios'

function RegisterPage() {
const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);  


  const onSubmit = async (newUser) => {
    console.log(newUser)
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
          <button type="submit" className="w-full bg-blue-600 mb-4 text-white p-2 rounded hover:bg-blue-700 hover:cursor-pointer" > Register </button>
          <div className="">
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage