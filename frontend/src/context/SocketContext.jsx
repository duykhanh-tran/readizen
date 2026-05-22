import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { getAccessToken } from '../services/axios.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Chỉ thiết lập kết nối khi người dùng đã được xác thực hoàn toàn
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        console.log('🔴 Global Socket disconnected due to logout');
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const token = getAccessToken();

    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🟢 Global Socket connected successfully:', newSocket.id);
      
      // Tự động join room của người dùng ngay khi kết nối thành công
      const userId = user.id || user._id;
      newSocket.emit('join_room', userId);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Global Socket connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log('🔴 Global Socket disconnected on unmount');
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
