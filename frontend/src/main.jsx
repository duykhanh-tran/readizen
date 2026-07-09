import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import Learn from './pages/Learn.jsx'
import Practice from './pages/Practice.jsx'
import Tech from './pages/Tech.jsx'
import About from './pages/About.jsx'
import Product from './pages/Product.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import TrialLesson from './pages/TrialLesson.jsx'
import Library from './pages/Library.jsx'
import Alphatest from './pages/Alphatest.jsx'
import AlphabetBoard from './pages/AlphabetBoard.jsx'
import AlphabetLesson from './pages/AlphabetLesson.jsx'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'
import AdminRoute from './components/shared/AdminRoute.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminForms from './pages/admin/Forms.jsx'
import AdminChat from './pages/admin/Chat.jsx'
import AdminLessons from './pages/admin/Lessons.jsx'
import EditLesson from './pages/admin/EditLesson.jsx'
import ManageAlphabet from './pages/admin/ManageAlphabet.jsx'
import EditAlphabetLesson from './pages/admin/EditAlphabetLesson.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import ScrollToTop from './components/shared/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/tech" element={<Tech />} />
            <Route path="/about" element={<About />} />
            <Route path="/alphatest" element={<Alphatest />} />
            <Route path="/product" element={<Navigate to="/library" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Client Routes open to all (no login required) */}
            <Route path="/library" element={<Library />} />
            <Route path="/lessons/:id" element={<TrialLesson />} />

            {/* Protected Client Route */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/alphabet" element={<ProtectedRoute><AlphabetBoard /></ProtectedRoute>} />
            <Route path="/alphabet/:id" element={<ProtectedRoute><AlphabetLesson /></ProtectedRoute>} />
            
            {/* Admin Routes Protected Layout */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="forms" element={<AdminForms />} />
              <Route path="chat" element={<AdminChat />} />
              <Route path="lessons" element={<AdminLessons />} />
              <Route path="lessons/edit/:lessonId" element={<EditLesson />} />
              <Route path="alphabet" element={<ManageAlphabet />} />
              <Route path="alphabet/edit/:id" element={<EditAlphabetLesson />} />
            </Route>
          </Routes>
          <Analytics />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
