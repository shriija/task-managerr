import { NavLink } from "react-router"


function Navbar() {
  return (
     <div className="">
        <div className="">
        <img width="80px" className="p-2" src="" alt="" />

        <ul className="">
            <li>
                <NavLink to="" className={({isActive})=>isActive? "": ""} >Home</NavLink>
            </li>
            <li>
                <NavLink to="register" className={({isActive})=>isActive? "": ""}>Register</NavLink>
            </li>
            <li>
                <NavLink to="login" className={({isActive})=>isActive? "": ""}>Login</NavLink>
            </li>
        </ul>
        </div>
    </div>
  )
}

export default Navbar