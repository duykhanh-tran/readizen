import React, { useState } from 'react';
import { User, Key, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileTab({ user, updateAvatar, updatePassword }) {
  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Update Avatar Handler
  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    setAvatarError('');
    setAvatarSuccess('');
    setIsUpdatingAvatar(true);

    if (!avatarUrl.trim()) {
      setAvatarError('Vui lòng nhập đường dẫn ảnh hợp lệ.');
      setIsUpdatingAvatar(false);
      return;
    }

    try {
      await updateAvatar(avatarUrl);
      setAvatarSuccess('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      setAvatarError(err.message || 'Cập nhật ảnh đại diện thất bại.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // Update Password Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    setIsUpdatingPass(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Vui lòng nhập đầy đủ các trường mật khẩu.');
      setIsUpdatingPass(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Mật khẩu mới phải chứa ít nhất 6 ký tự.');
      setIsUpdatingPass(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu mới nhập lại không khớp.');
      setIsUpdatingPass(false);
      return;
    }

    try {
      await updatePassword(oldPassword, newPassword);
      setPassSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.message || 'Thay đổi mật khẩu thất bại. Mật khẩu cũ không chính xác.');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Avatar Update */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
        <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
          <User className="w-4.5 h-4.5 text-brand-green" />
          <span>Ảnh đại diện</span>
        </h3>
        <form onSubmit={handleUpdateAvatar} className="space-y-4">
          {avatarError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{avatarError}</span>
            </div>
          )}
          {avatarSuccess && (
            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{avatarSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Đường dẫn ảnh cá nhân (URL)
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingAvatar}
            className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm text-xs cursor-pointer disabled:opacity-50"
          >
            {isUpdatingAvatar ? 'Đang cập nhật...' : 'Cập nhật Avatar'}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
        <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
          <Key className="w-4.5 h-4.5 text-brand-green" />
          <span>Mật khẩu & Bảo mật</span>
        </h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {passError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{passError}</span>
            </div>
          )}
          {passSuccess && (
            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Nhập lại mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPass}
            className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm text-xs cursor-pointer disabled:opacity-50"
          >
            {isUpdatingPass ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
