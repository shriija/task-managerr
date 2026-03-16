import { useForm } from "react-hook-form";

function Loginpage() {

  const {register,handleSubmit,formState:{errors}}=useForm()
// 
  const onUserLogin = async(userCredObj) => {
    await login(userCredObj)
  }

  return(
    <div className=" mt-10">
      <form onSubmit={handleSubmit(onUserLogin)} className="">

        <h2 className="">Login</h2>

        <div className="">
          <input type="email" placeholder="Email" {...register("email",{required:true})} className=""/>
        </div>

        <div className="">
          <input type="password" placeholder="Password" {...register("password",{required:true})} className=""/>
        </div>

        <button className="">Login</button>
      </form>
    </div>
  )
}

export default Loginpage