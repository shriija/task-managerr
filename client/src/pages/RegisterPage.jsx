import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import axios from 'axios'
import { API_URL } from "../services/api"
import toast from 'react-hot-toast'

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend
    try {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.post(`${API_URL}/user-api/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setAvatarUrl(res.data.url);
      toast.success("Avatar uploaded!");
    } catch (err) {
      toast.error("Avatar upload failed");
      setAvatarPreview(null);
      setAvatarUrl("");
    } finally {
      setAvatarUploading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (newUser) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        avatar: avatarUrl || ""
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

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Profile Picture (Optional)</label>
            <div className="relative group">
              <div
                onClick={() => !avatarUploading && fileInputRef.current?.click()}
                className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200
                  ${avatarPreview
                    ? "border-primary-300 bg-primary-50"
                    : "border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50"
                  } ${avatarUploading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                  </div>
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {avatarPreview && !avatarUploading && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                  title="Remove avatar"
                >
                  ✕
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <p className="text-[10px] text-slate-400 mt-2">Click to upload • Max 5MB</p>
          </div>

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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
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
            disabled={loading || avatarUploading}
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