import axios from 'axios';

// Lấy base URL từ môi trường hoặc dùng mặc định
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Biến lưu trữ Access Token trong bộ nhớ tạm (in-memory) để đảm bảo bảo mật
let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

// Khởi tạo instance Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Bắt buộc để gửi kèm HttpOnly Cookie (Refresh Token)
});

// Request Interceptor: Tự động đính kèm Access Token vào Header của mỗi request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi tập trung và tự động làm mới token (Refresh Token Rotation)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu gặp lỗi 401 hoặc 403 và request này chưa từng được thử lại (chống lặp vô tận)
    if (
      (error.response?.status === 401 || error.response?.status === 403) && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Thực hiện gọi API Refresh Token độc lập (dùng instance axios thuần để tránh interceptor can thiệp)
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { accessToken: newAccessToken } = response.data;
        
        // Lưu trữ Access Token mới
        setAccessToken(newAccessToken);
        
        // Cập nhật lại header Authorization cho request gốc và gửi lại
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token hết hạn hoặc không hợp lệ -> Xóa Access Token và đẩy lỗi ra ngoài
        setAccessToken('');
        // Tạo sự kiện logout hoặc bắn lỗi để AuthContext bắt được
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
