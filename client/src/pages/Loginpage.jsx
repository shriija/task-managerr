import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { errorClass, submitBtn, formCard, formTitle, inputClass, formGroup } from "../styles/common";
import {toast} from 'react-hot-toast'

function Loginpage() {

  const {register,handleSubmit,formState:{errors}}=useForm()
  const login = useAuth(state => state.login)
  const isAuthenticated = useAuth((state)=> state.isAuthenticated)
  const currentUser = useAuth((state)=>state.currentUser)
  const error = useAuth((state)=>state.error)
  const navigate = useNavigate()

  const onUserLogin = async(userCredObj) => {
    await login(userCredObj)
  }

  useEffect(()=>{
    if (isAuthenticated){
      if(currentUser.role === "USER"){
        toast.success("Logged in successfully")
        navigate("/userdashboard")
      }
    if(currentUser.role === "AUTHOR"){
      toast.success("Logged in successfully")
      navigate("/authordashboard")
    }
  }},[isAuthenticated,currentUser])

  return(
    <div className=" mt-10">
      <form onSubmit={handleSubmit(onUserLogin)} className={formCard}>
        {error && <p className={errorClass}>{error}</p>}

        <h2 className={formTitle}>Login</h2>

        <div className={formGroup}>
          <input type="email" placeholder="Email" {...register("email",{required:true})} className={inputClass}/>
        </div>

        <div className={formGroup}>
          <input type="password" placeholder="Password" {...register("password",{required:true})} className={inputClass}/>
        </div>

        <button className={submitBtn}>Login</button>
      </form>
    </div>
  )
}

export default Loginpage