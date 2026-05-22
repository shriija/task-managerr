import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../context/AuthContext";

function Loginpage() {
  const { register, handleSubmit } = useForm();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const navigate = useNavigate();

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
    if (useAuthStore.getState().isAuthenticated) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 select-none p-6 font-body">
      <div className="bg-white border border-slate-200/80 shadow-xl shadow-slate-100 rounded-2xl p-8 max-w-md w-full">
        
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Enter your credentials to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-5">
          {/* Server Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl text-center">
              <p className="text-red-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              {...register("email", { required: true })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              {...register("password", { required: true })} 
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md shadow-primary-500/10 focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

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