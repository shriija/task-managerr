import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router'
import RegisterPage from './pages/RegisterPage'
import Loginpage from './pages/Loginpage'
import RootLayout from './pages/RootLayout'
import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import CreateBoardPage from './pages/CreateBoardPage'
import ProtectedRoute from './components/ProtectedRoute'
import BoardPage from './pages/BoardPage'
import AcceptInvitePage from './pages/AcceptInvitePage'
import AccountManagementPage from './pages/AccountManagementPage'

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
          path:"/profile",
          element:(
            <ProtectedRoute>
              <AccountManagementPage />
            </ProtectedRoute>
          )
        },
        {
          path:"/dashboard",
          element:(
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          )
        },
        {
          path:"/dashboard/:tab",
          element:(
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          )
        },
        {
          path:"create-board",
          element:(
            <ProtectedRoute>
              <CreateBoardPage/>
            </ProtectedRoute>
          )
        },
        {
          path:"board/:id",
          element:(
            <ProtectedRoute>
              <BoardPage/>
            </ProtectedRoute>
          )
        },
        {
          path:"board/:id/:view",
          element:(
            <ProtectedRoute>
              <BoardPage/>
            </ProtectedRoute>
          )
        },
        {
          path:"invite/:token",
          element:(
            <ProtectedRoute>
              <AcceptInvitePage/>
            </ProtectedRoute>
          )
        },
      ]
    }
  ])

  return (<>
    <RouterProvider router={routerObj} />

  </>)
}

export default App