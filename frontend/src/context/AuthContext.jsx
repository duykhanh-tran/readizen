import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, addTokenListener } from '../services/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm khôi phục phiên đăng nhập khi load trang
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/session');
      if (response.data && response.data.authenticated) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setAccessToken('');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = addTokenListener((token) => {
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Đăng nhập tài khoản Client
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data;
      
      setAccessToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error.response?.data || { message: 'Đã xảy ra lỗi đăng nhập.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập tài khoản Quản trị (Admin)
  const adminLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/admin/login', { username, password });
      const { accessToken } = response.data;
      
      setAccessToken(accessToken);
      
      const adminResponse = await api.get('/auth/me');
      const adminData = { ...adminResponse.data, role: 'admin' };
      
      setUser(adminData);
      setIsAuthenticated(true);
      return adminData;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error.response?.data || { message: 'Đăng nhập admin thất bại.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký tài khoản mới cho Client
  const register = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng ký thất bại.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi mật khẩu
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/auth/password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đổi mật khẩu thất bại.' };
    }
  };

  // Cập nhật Avatar URL
  const updateAvatar = async (avatarUrl) => {
    try {
      const response = await api.put('/auth/avatar', { avatarUrl });
      // Cập nhật lại thông tin user trong local state
      setUser(prev => prev ? { ...prev, avatarUrl: response.data.user.avatarUrl } : null);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Cập nhật avatar thất bại.' };
    }
  };

  // Đăng xuất
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi khi gọi API logout:', error);
    } finally {
      setAccessToken('');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        updatePassword,
        updateAvatar,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
