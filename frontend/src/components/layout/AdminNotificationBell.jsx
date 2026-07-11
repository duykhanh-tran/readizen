import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShieldAlert, Sparkles, Video, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/axios.js';

export default function AdminNotificationBell() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Khởi tạo và tải dữ liệu logs từ API
  useEffect(() => {
    // CHỐT CHẶN AN TOÀN: Chỉ gọi API nếu đã đăng nhập và là Admin
    if (!user || user.role !== 'admin') return;

    const fetchActivities = async () => {
      try {
        const response = await api.get('/admin/activity-logs');
        setActivities(response.data);

        // Đọc mốc thời gian xem gần nhất từ LocalStorage
        const lastViewedTime = Number(localStorage.getItem('admin_last_viewed_notifications') || 0);

        // CHỐT CHẶN AN TOÀN: Ép kiểu sang số timestamp trước khi so sánh tránh lỗi so sánh chuỗi
        const count = response.data.filter(
          (act) => new Date(act.createdAt).getTime() > lastViewedTime
        ).length;

        setUnreadCount(count);
      } catch (error) {
        console.error('Không thể tải nhật ký hoạt động hệ thống:', error);
      }
    };

    fetchActivities();
  }, [user]);

  // Lắng nghe sự kiện Socket.io thời gian thực
  useEffect(() => {
    // CHỐT CHẶN AN TOÀN: Chỉ lắng nghe socket nếu là Admin và Socket đã được kết nối
    if (!user || user.role !== 'admin' || !socket) return;

    const handleNewActivity = (activity) => {
      // Đưa log mới lên đầu danh sách
      setActivities((prev) => [activity, ...prev].slice(0, 100));

      // Tính toán unread count
      const lastViewedTime = Number(localStorage.getItem('admin_last_viewed_notifications') || 0);
      if (new Date(activity.createdAt).getTime() > lastViewedTime) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on('new_admin_activity', handleNewActivity);

    // CHỐT CHẶN AN TOÀN: Cleanup listener khi unmount để phòng rò rỉ bộ nhớ
    return () => {
      socket.off('new_admin_activity', handleNewActivity);
    };
  }, [socket, user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Khi Admin mở xem danh sách: Reset số lượng chưa đọc về 0
      setUnreadCount(0);
      // Lưu mốc thời gian hiện tại vào LocalStorage
      localStorage.setItem('admin_last_viewed_notifications', Date.now().toString());
    }
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'Alphabet':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'Reading':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionBadgeClass = (actionType) => {
    switch (actionType) {
      case 'CREATE':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'UPDATE':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const formatRelativeTime = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return new Date(dateString).toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Chỉ hiển thị đối với tài khoản Admin
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="relative font-sans z-40" ref={dropdownRef}>
      {/* Icon chuông thông báo */}
      <button
        onClick={handleToggleDropdown}
        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition shadow-sm cursor-pointer relative"
        aria-label="Thông báo hệ thống"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform origin-top-right transition duration-200 z-50">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">Hoạt động hệ thống</h3>
            <span className="text-[10px] bg-brand-light text-brand-green font-bold px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <ShieldAlert className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-semibold">Chưa có hoạt động nào được ghi nhận</p>
              </div>
            ) : (
              activities.slice(0, 10).map((log) => (
                <div key={log._id} className="p-4 hover:bg-gray-50/50 transition duration-150">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg flex-shrink-0 mt-0.5">
                      {getModuleIcon(log.module)}
                    </div>
                    <div className="flex-grow space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-gray-800 truncate">
                          {log.adminId?.fullName || 'Hệ thống'}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${getActionBadgeClass(log.actionType)}`}>
                          {log.actionType}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium break-words leading-relaxed">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(log.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 font-bold">
              Hiển thị tối đa 10 hoạt động gần nhất
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
