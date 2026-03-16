import { useForm } from "react-hook-form";
import { NavLink } from "react-router";

function Loginpage() {

  const {register,handleSubmit,formState:{errors}}=useForm()
// 
  const onUserLogin = async(userCredObj) => {
    console.log(userCredObj)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <form onSubmit={handleSubmit(onUserLogin)} className="bg-white shadow-lg rounded-lg p-8 w-100">

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <input type="email" placeholder="Email" {...register("email",{required:true})} className="w-full border rounded p-2 mb-2"/>
        </div>

        <div className="mb-1">
          <input type="password" placeholder="Password" {...register("password",{required:true})} className="w-full border rounded p-2 mb-4"/>
        </div>
				
        <div className="flex items-center justify-between mb-4 ">
        	<div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
          </div>
        </div>

        <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
        	<NavLink to="/register" className="font-semibold text-primary-600 hover:text-primary-500">  Sign up for free </NavLink>
        </p>
      </form>
    </div>
  )
}

export default Loginpage