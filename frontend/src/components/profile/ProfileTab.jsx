import React, { useState } from 'react';
import { User, Key, AlertCircle, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const PRESET_AVATARS = [
  {
    id: 'panda',
    name: 'Gấu Trúc',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E8F5E9"/>
      <circle cx="28" cy="28" r="12" fill="#2D3748"/>
      <circle cx="72" cy="28" r="12" fill="#2D3748"/>
      <circle cx="28" cy="28" r="6" fill="#1A202C"/>
      <circle cx="72" cy="28" r="6" fill="#1A202C"/>
      <ellipse cx="50" cy="58" rx="34" ry="26" fill="#FFFFFF"/>
      <ellipse cx="38" cy="52" rx="10" ry="12" fill="#2D3748" transform="rotate(-10 38 52)"/>
      <ellipse cx="62" cy="52" rx="10" ry="12" fill="#2D3748" transform="rotate(10 62 52)"/>
      <circle cx="39" cy="50" r="4" fill="#FFFFFF"/>
      <circle cx="61" cy="50" r="4" fill="#FFFFFF"/>
      <circle cx="40" cy="49" r="1.5" fill="#1A202C"/>
      <circle cx="60" cy="49" r="1.5" fill="#1A202C"/>
      <polygon points="46,62 54,62 50,66" fill="#1A202C"/>
      <path d="M46,68 Q50,71 54,68" stroke="#1A202C" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="26" cy="62" r="4" fill="#FED7D7"/>
      <circle cx="74" cy="62" r="4" fill="#FED7D7"/>
    </svg>`
  },
  {
    id: 'fox',
    name: 'Cáo Con',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#FFFAF0"/>
      <polygon points="15,40 38,15 45,42" fill="#ED8936"/>
      <polygon points="85,40 62,15 55,42" fill="#ED8936"/>
      <polygon points="20,38 34,20 38,38" fill="#FEEBC8"/>
      <polygon points="80,38 66,20 62,38" fill="#FEEBC8"/>
      <path d="M15,50 Q15,72 50,72 Q85,72 85,50 Q85,38 50,38 Q15,38 15,50 Z" fill="#ED8936"/>
      <path d="M15,50 Q30,68 50,68 Q70,68 85,50 Q75,48 50,56 Q25,48 15,50 Z" fill="#FFFFFF"/>
      <circle cx="50" cy="65" r="4.5" fill="#2D3748"/>
      <circle cx="36" cy="48" r="4" fill="#2D3748"/>
      <circle cx="64" cy="48" r="4" fill="#2D3748"/>
      <circle cx="37" cy="47" r="1.5" fill="#FFFFFF"/>
      <circle cx="63" cy="47" r="1.5" fill="#FFFFFF"/>
      <path d="M44,60 Q50,62 56,60" stroke="#2D3748" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'koala',
    name: 'Koala',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#EBF8FF"/>
      <circle cx="22" cy="36" r="16" fill="#A0AEC0"/>
      <circle cx="78" cy="36" r="16" fill="#A0AEC0"/>
      <circle cx="22" cy="36" r="10" fill="#EDF2F7"/>
      <circle cx="78" cy="36" r="10" fill="#EDF2F7"/>
      <circle cx="50" cy="55" r="28" fill="#A0AEC0"/>
      <path d="M18,36 Q22,30 26,36" stroke="#E2E8F0" stroke-width="2" fill="none"/>
      <path d="M74,36 Q78,30 82,36" stroke="#E2E8F0" stroke-width="2" fill="none"/>
      <circle cx="38" cy="50" r="3.5" fill="#2D3748"/>
      <circle cx="62" cy="50" r="3.5" fill="#2D3748"/>
      <circle cx="39" cy="49" r="1" fill="#FFFFFF"/>
      <circle cx="61" cy="49" r="1" fill="#FFFFFF"/>
      <ellipse cx="50" cy="58" rx="7" ry="11" fill="#2D3748"/>
      <circle cx="28" cy="58" r="3.5" fill="#FED7D7"/>
      <circle cx="72" cy="58" r="3.5" fill="#FED7D7"/>
    </svg>`
  },
  {
    id: 'rabbit',
    name: 'Thỏ Ú',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#FFF5F5"/>
      <ellipse cx="36" cy="24" rx="8" ry="22" fill="#FEB2B2" transform="rotate(-8 36 24)"/>
      <ellipse cx="64" cy="24" rx="8" ry="22" fill="#FEB2B2" transform="rotate(8 64 24)"/>
      <ellipse cx="36" cy="25" rx="4" ry="16" fill="#FFF5F5" transform="rotate(-8 36 25)"/>
      <ellipse cx="64" cy="25" rx="4" ry="16" fill="#FFF5F5" transform="rotate(8 64 25)"/>
      <circle cx="50" cy="60" r="26" fill="#FEB2B2"/>
      <circle cx="40" cy="56" r="3" fill="#2D3748"/>
      <circle cx="60" cy="56" r="3" fill="#2D3748"/>
      <circle cx="41" cy="55" r="1" fill="#FFFFFF"/>
      <circle cx="59" cy="55" r="1" fill="#FFFFFF"/>
      <polygon points="48,63 52,63 50,65" fill="#E53E3E"/>
      <path d="M47,69 Q50,71 53,69" stroke="#E53E3E" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="64" r="3.5" fill="#FED7D7"/>
      <circle cx="70" cy="64" r="3.5" fill="#FED7D7"/>
    </svg>`
  },
  {
    id: 'lion',
    name: 'Sư Tử',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#FFFDF0"/>
      <path d="M50,15 C56,15 54,23 60,20 C66,17 62,26 68,25 C74,24 68,32 74,34 C80,36 72,42 76,46 C80,50 72,54 74,60 C76,66 68,66 68,72 C68,78 60,74 56,79 C52,84 48,84 44,79 C40,74 32,78 32,72 C32,66 24,66 26,60 C28,54 20,54 24,46 C28,42 20,36 26,34 C32,32 26,24 32,25 C38,26 34,17 40,20 C46,23 44,15 50,15 Z" fill="#DD6B20"/>
      <circle cx="50" cy="50" r="23" fill="#F6AD55"/>
      <circle cx="34" cy="34" r="6" fill="#DD6B20"/>
      <circle cx="66" cy="34" r="6" fill="#DD6B20"/>
      <circle cx="34" cy="34" r="3" fill="#F6AD55"/>
      <circle cx="66" cy="34" r="3" fill="#F6AD55"/>
      <circle cx="42" cy="46" r="3" fill="#2D3748"/>
      <circle cx="58" cy="46" r="3" fill="#2D3748"/>
      <circle cx="43" cy="45" r="1" fill="#FFFFFF"/>
      <circle cx="57" cy="45" r="1" fill="#FFFFFF"/>
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#FFF5F5"/>
      <polygon points="47,51 53,51 50,54" fill="#2D3748"/>
      <path d="M48,57 Q50,59 52,57" stroke="#2D3748" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'cat',
    name: 'Mèo Lười',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F3E8FF"/>
      <polygon points="20,44 26,16 46,36" fill="#D6BCFA"/>
      <polygon points="80,44 74,16 54,36" fill="#D6BCFA"/>
      <polygon points="24,41 29,22 41,34" fill="#FFD2D2"/>
      <polygon points="76,41 71,22 59,34" fill="#FFD2D2"/>
      <circle cx="50" cy="56" r="26" fill="#D6BCFA"/>
      <circle cx="40" cy="52" r="3" fill="#2D3748"/>
      <circle cx="60" cy="52" r="3" fill="#2D3748"/>
      <circle cx="41" cy="51" r="1" fill="#FFFFFF"/>
      <circle cx="59" cy="51" r="1" fill="#FFFFFF"/>
      <polygon points="48,58 52,58 50,60" fill="#D53F8C"/>
      <path d="M46,63 Q50,65 54,63" stroke="#2D3748" stroke-width="2" fill="none" stroke-linecap="round"/>
      <line x1="22" y1="56" x2="32" y2="58" stroke="#2D3748" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="22" y1="62" x2="32" y2="61" stroke="#2D3748" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="78" y1="56" x2="68" y2="58" stroke="#2D3748" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="78" y1="62" x2="68" y2="61" stroke="#2D3748" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'owl',
    name: 'Cú Tròn',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#E2F9FB"/>
      <ellipse cx="50" cy="56" rx="26" ry="28" fill="#4FD1C5"/>
      <ellipse cx="50" cy="62" rx="16" ry="16" fill="#E6FFFA"/>
      <path d="M46,60 Q50,63 54,60" stroke="#319795" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M42,66 Q46,69 50,66" stroke="#319795" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M50,66 Q54,69 58,66" stroke="#319795" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="38" cy="44" r="10" fill="#FFFFFF"/>
      <circle cx="62" cy="44" r="10" fill="#FFFFFF"/>
      <circle cx="38" cy="44" r="5.5" fill="#2D3748"/>
      <circle cx="62" cy="44" r="5.5" fill="#2D3748"/>
      <circle cx="39" cy="43" r="1.5" fill="#FFFFFF"/>
      <circle cx="63" cy="43" r="1.5" fill="#FFFFFF"/>
      <polygon points="46,49 54,49 50,56" fill="#ED8936"/>
      <polygon points="26,34 38,24 42,34" fill="#4FD1C5"/>
      <polygon points="74,34 62,24 58,34" fill="#4FD1C5"/>
    </svg>`
  },
  {
    id: 'elephant',
    name: 'Voi Con',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#EDF2F7"/>
      <ellipse cx="26" cy="48" rx="15" ry="20" fill="#CBD5E0"/>
      <ellipse cx="74" cy="48" rx="15" ry="20" fill="#CBD5E0"/>
      <ellipse cx="28" cy="48" rx="10" ry="14" fill="#FED7D7"/>
      <ellipse cx="72" cy="48" rx="10" ry="14" fill="#FED7D7"/>
      <ellipse cx="50" cy="54" rx="23" ry="20" fill="#CBD5E0"/>
      <circle cx="42" cy="48" r="3" fill="#2D3748"/>
      <circle cx="58" cy="48" r="3" fill="#2D3748"/>
      <circle cx="43" cy="47" r="1" fill="#FFFFFF"/>
      <circle cx="57" cy="47" r="1" fill="#FFFFFF"/>
      <path d="M50,56 Q50,72 42,72 Q38,72 38,68" stroke="#CBD5E0" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M42,58 L38,62 L42,60 Z" fill="#FFFFFF"/>
      <path d="M58,58 L62,62 L58,60 Z" fill="#FFFFFF"/>
    </svg>`
  }
];

export default function ProfileTab({ user, updateAvatar, updatePassword }) {
  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const getSvgDataUri = (svgStr) => {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
  };

  // Select Preset Avatar
  const handleSelectPreset = async (svgStr) => {
    setIsUpdatingAvatar(true);
    const dataUri = getSvgDataUri(svgStr);
    try {
      await updateAvatar(dataUri);
      setAvatarUrl(dataUri);
      toast.success('Đã đổi hình đại diện động vật thành công!');
    } catch (err) {
      toast.error(err.message || 'Cập nhật avatar thất bại.');
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // Update Custom URL Avatar Handler
  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarUrl.trim()) {
      toast.error('Vui lòng nhập đường dẫn ảnh hợp lệ.');
      return;
    }
    setIsUpdatingAvatar(true);

    try {
      await updateAvatar(avatarUrl);
      toast.success('Cập nhật ảnh đại diện tùy chỉnh thành công!');
    } catch (err) {
      toast.error(err.message || 'Cập nhật ảnh đại diện thất bại.');
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Preset Animals Avatar Selection (Kid Friendly) */}
      <div className="xl:col-span-7 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 text-left">
        <div>
          <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-green" />
            Chọn hình đại diện ngộ nghĩnh
          </h3>
          <p className="text-xs text-gray-400 mt-1">Các bé hãy chọn một con vật dễ thương dưới đây để làm ảnh đại diện nhé!</p>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-4 gap-3">
          {PRESET_AVATARS.map((avatar) => {
            const avatarDataUri = getSvgDataUri(avatar.svg);
            const isSelected = user?.avatarUrl === avatarDataUri;

            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSelectPreset(avatar.svg)}
                disabled={isUpdatingAvatar}
                className={`aspect-square rounded-2xl overflow-hidden p-1 transition duration-200 cursor-pointer relative group flex flex-col items-center justify-center border-3 ${
                  isSelected 
                    ? 'border-brand-green bg-brand-light/20 scale-105 shadow-md' 
                    : 'border-transparent bg-gray-55/10 hover:border-brand-green/30 hover:scale-102'
                }`}
                title={avatar.name}
              >
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: avatar.svg }}
                />
                <span className="absolute bottom-1 bg-black/60 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatar.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom URL Field (Adult Friendly) */}
        <div className="pt-4 border-t border-gray-100">
          <form onSubmit={handleUpdateAvatar} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Hoặc sử dụng ảnh liên kết riêng (URL)
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Dán link ảnh tại đây..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingAvatar || !avatarUrl}
              className="bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-5 rounded-xl transition duration-200 shadow-sm text-xs cursor-pointer disabled:opacity-50"
            >
              Lưu ảnh tùy chỉnh
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Password Change */}
      <div className="xl:col-span-5 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm text-left">
        <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
          <Key className="w-4.5 h-4.5 text-brand-green" />
          <span>Mật khẩu & Bảo mật</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1 mb-5">Thay đổi mật khẩu đăng nhập của tài khoản ba mẹ.</p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {passError && (
            <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{passError}</span>
            </div>
          )}
          {passSuccess && (
            <div className="bg-green-50 text-green-700 text-xs p-3.5 rounded-xl border border-green-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nhập lại mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPass}
            className="w-full bg-brand-green hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md text-xs cursor-pointer disabled:opacity-50"
          >
            {isUpdatingPass ? 'Đang cập nhật...' : 'Đổi mật khẩu tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}
