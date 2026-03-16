import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router'
import RegisterPage from './pages/RegisterPage'
import Loginpage from './pages/Loginpage'

function App() {
  return (
    <>
    <RegisterPage/>
    <Loginpage />
    </>
  )
}

export default App