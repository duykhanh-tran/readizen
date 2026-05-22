import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center font-sans">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-light"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-green animate-spin"></div>
        </div>
        <p className="mt-4 text-brand-dark font-medium text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chuyển hướng về trang đăng nhập và lưu lại trang trước đó để sau khi login có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
