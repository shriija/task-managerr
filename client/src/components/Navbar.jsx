import { NavLink } from "react-router"
import { navbarClass, navContainerClass, navLinksClass, navLinkClass, navLinkActiveClass } from "../styles/common"

function Navbar() {
  return (
     <div className={navbarClass}>
        <div className={navContainerClass}>
        <img width="80px" className="p-2" src="" alt="" />

        <ul className={navLinksClass}>
            <li>
                <NavLink to="" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass} >Home</NavLink>
            </li>
            <li>
                <NavLink to="register" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass}>Register</NavLink>
            </li>
            <li>
                <NavLink to="login" className={({isActive})=>isActive?navLinkActiveClass:navLinkClass}>Login</NavLink>
            </li>
        </ul>
        </div>
    </div>
  )
}

export default Navbar