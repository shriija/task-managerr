import { useForm } from "react-hook-form";

function Loginpage() {

  const {register,handleSubmit,formState:{errors}}=useForm()
// 
  const onUserLogin = async(userCredObj) => {
    await login(userCredObj)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-10">
      <form onSubmit={handleSubmit(onUserLogin)} className="bg-white shadow-lg rounded-lg p-8 w-100">

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <input type="email" placeholder="Email" {...register("email",{required:true})} className="w-full border rounded p-2 mb-2"/>
        </div>

        <div className="">
          <input type="password" placeholder="Password" {...register("password",{required:true})} className="w-full border rounded p-2 mb-4"/>
        </div>

        <button className="w-full mb-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  )
}

export default Loginpage