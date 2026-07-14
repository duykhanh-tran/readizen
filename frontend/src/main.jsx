import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Loader2 } from 'lucide-react'
import './index.css'
import App from './App.jsx'
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'
import AdminRoute from './components/shared/AdminRoute.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import ScrollToTop from './components/shared/ScrollToTop.jsx'
import { Toaster } from 'react-hot-toast'
import FloatingChat from './components/shared/FloatingChat.jsx'

// Lazy loaded page components
const Learn = lazy(() => import('./pages/Learn.jsx'))
const Practice = lazy(() => import('./pages/Practice.jsx'))
const Tech = lazy(() => import('./pages/Tech.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const TrialLesson = lazy(() => import('./pages/TrialLesson.jsx'))
const Library = lazy(() => import('./pages/Library.jsx'))
const Alphatest = lazy(() => import('./pages/Alphatest.jsx'))
const AlphabetBoard = lazy(() => import('./pages/AlphabetBoard.jsx'))
const AlphabetLesson = lazy(() => import('./pages/AlphabetLesson.jsx'))
const VideoTopics = lazy(() => import('./pages/VideoTopics.jsx'))
const TopicVideosList = lazy(() => import('./pages/TopicVideosList.jsx'))
const VideoPlayerFocus = lazy(() => import('./pages/VideoPlayerFocus.jsx'))

// Admin lazy loaded page components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminForms = lazy(() => import('./pages/admin/Forms.jsx'))
const AdminChat = lazy(() => import('./pages/admin/Chat.jsx'))
const AdminLessons = lazy(() => import('./pages/admin/Lessons.jsx'))
const EditLesson = lazy(() => import('./pages/admin/EditLesson.jsx'))
const ManageAlphabet = lazy(() => import('./pages/admin/ManageAlphabet.jsx'))
const EditAlphabetLesson = lazy(() => import('./pages/admin/EditAlphabetLesson.jsx'))
const ManageVideos = lazy(() => import('./pages/admin/ManageVideos.jsx'))
const EditVideoLesson = lazy(() => import('./pages/admin/EditVideoLesson.jsx'))

const LoadingSpinner = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFDF3]">
    <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
    <span className="mt-3 text-sm font-bold text-gray-600">Đang tải trang...</span>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <SocketProvider>
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/smartabc" element={<AlphabetBoard />} />
              <Route path="/smartabc/:id" element={<AlphabetLesson />} />
              <Route path="/videos" element={<VideoTopics />} />
              <Route path="/videos/:slug" element={<TopicVideosList />} />
              <Route path="/videos/:slug/:lessonSlug" element={<VideoPlayerFocus />} />

              {/* Protected Client Route */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Admin Routes Protected Layout */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="forms" element={<AdminForms />} />
                <Route path="chat" element={<AdminChat />} />
                <Route path="lessons" element={<AdminLessons />} />
                <Route path="lessons/edit/:lessonId" element={<EditLesson />} />
                <Route path="alphabet" element={<ManageAlphabet />} />
                <Route path="alphabet/edit/:id" element={<EditAlphabetLesson />} />
                <Route path="videos" element={<ManageVideos />} />
                <Route path="videos/create" element={<EditVideoLesson />} />
                <Route path="videos/edit/:id" element={<EditVideoLesson />} />
              </Route>
            </Routes>
            <FloatingChat />
          </Suspense>
          <Analytics />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
