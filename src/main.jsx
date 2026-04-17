import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Internships from './pages/Internships'
import Hackathons from './pages/Hackathons'
import Webinars from './pages/Webinars'
import { Login, Register } from './pages/LoginRegister'
import Profile from './pages/Profile'
import ResumeUpload from './pages/ResumeUpload'
import './index.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', color:'#888', background:'#060912', fontSize:14 }}>
      Loading...
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index            element={<Dashboard />} />
              <Route path="jobs"        element={<Jobs />} />
              <Route path="internships" element={<Internships />} />
              <Route path="hackathons"  element={<Hackathons />} />
              <Route path="webinars"    element={<Webinars />} />
              <Route path="resume"      element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
              <Route path="profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
