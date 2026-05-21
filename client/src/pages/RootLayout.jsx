import { Outlet, useLocation } from 'react-router'
import Navbar from '../components/Navbar'

function RootLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === "/"

  return (
    <div>
        {!isLandingPage && <Navbar />}
        <div className=''>
            <Outlet />
        </div>
    </div>
  )
}

export default RootLayout