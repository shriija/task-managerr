import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router'
import RegisterPage from './pages/RegisterPage'
import Loginpage from './pages/Loginpage'
import RootLayout from './pages/RootLayout'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import CreateBoardPage from './pages/CreateBoardPage'

function App() {
  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout />,
      children:[
        {
          path:"",
          element:<Home />
        },
        {
          path:"/register",
          element:<RegisterPage />
        },
        {
          path:"/login",
          element:<Loginpage />
        },
        {
          path:"/dashboard",
          element:<UserDashboard />
        },
        {
          path:"create-board",
          element:<CreateBoardPage/>
        }
      ]
    }
  ])

  return (<>
    <RouterProvider router={routerObj} />

  </>)
}

export default App