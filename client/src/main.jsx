import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <>
      <App />
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' }
      }} />
    </>
)
