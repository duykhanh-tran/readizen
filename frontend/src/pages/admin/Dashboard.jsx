import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  FileText,
  Layers3,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/axios.js';

const ACTION_STYLES = {
  CREATE: {
    label: 'Thêm mới',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  UPDATE: {
    label: 'Cập nhật',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  DELETE: {
    label: 'Xóa',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

const MODULE_STYLES = {
  Alphabet: {
    label: 'Bảng chữ cái',
    className: 'border-violet-200 bg-violet-50 text-violet-700',
  },
  Video: {
    label: 'Video bài giảng',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  Reading: {
    label: 'Luyện đọc AI',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

function StatSkeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.15] ${className}`} />;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/activity-logs'),
      ]);

      const logsData = Array.isArray(logsRes.data)
        ? logsRes.data
        : logsRes.data?.logs || [];

      setStats(statsRes.data || {});
      setRecentLogs(logsData.slice(0, 8));
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
        'Không thể đồng bộ dữ liệu thống kê từ hệ thống.',
      );
      console.error('Dashboard data error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const normalizedStats = useMemo(
    () => ({
      totalUsers: Number(stats?.totalUsers) || 0,
      totalReadingLessons: Number(stats?.totalReadingLessons) || 0,
      totalAlphabetLessons: Number(stats?.totalAlphabetLessons) || 0,
      totalVideoLessons: Number(stats?.totalVideoLessons) || 0,
    }),
    [stats],
  );

  const totalLearningItems = useMemo(
    () =>
      normalizedStats.totalReadingLessons +
      normalizedStats.totalAlphabetLessons +
      normalizedStats.totalVideoLessons,
    [normalizedStats],
  );

  const contentGroups = useMemo(
    () => [
      {
        key: 'reading',
        title: 'Luyện đọc AI',
        description: 'Bài luyện đọc và nội dung tương tác với AI',
        value: normalizedStats.totalReadingLessons,
        icon: BookOpen,
        href: '/admin/lessons',
        iconClass: 'bg-emerald-400/[0.15] text-emerald-200 ring-emerald-300/20',
        barClass: 'bg-emerald-300',
      },
      {
        key: 'alphabet',
        title: 'Bảng chữ cái A–Z',
        description: 'Học liệu phát âm và nhận diện chữ cái',
        value: normalizedStats.totalAlphabetLessons,
        icon: Sparkles,
        href: '/admin/alphabet',
        iconClass: 'bg-violet-400/[0.15] text-violet-200 ring-violet-300/20',
        barClass: 'bg-violet-300',
      },
      {
        key: 'video',
        title: 'Video bài giảng',
        description: 'Video học tập được phân loại theo chủ đề',
        value: normalizedStats.totalVideoLessons,
        icon: Video,
        href: '/admin/videos',
        iconClass: 'bg-blue-400/[0.15] text-blue-200 ring-blue-300/20',
        barClass: 'bg-blue-300',
      },
    ],
    [normalizedStats],
  );

  const activitySummary = useMemo(() => {
    return recentLogs.reduce(
      (summary, log) => {
        if (Object.prototype.hasOwnProperty.call(summary, log.actionType)) {
          summary[log.actionType] += 1;
        }
        return summary;
      },
      { CREATE: 0, UPDATE: 0, DELETE: 0 },
    );
  }, [recentLogs]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '--';

    return {
      date: date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const getPercentage = (value) => {
    if (!totalLearningItems) return 0;
    return Math.round((value / totalLearningItems) * 100);
  };

  return (
    <div className="space-y-6 pb-8 font-sans text-left text-slate-800 sm:space-y-8">
      {/* Page heading */}
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
            <span className="h-2 w-2 rounded-full bg-brand-green" />
            Trung tâm vận hành
          </div>
          <h1 className="text-2xl font-black tracking-[-0.025em] text-slate-950 sm:text-3xl">
            Bảng điều khiển quản trị
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Theo dõi toàn bộ học liệu, người dùng và các thao tác quản trị trong một giao diện tập trung.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{new Date().toLocaleDateString('vi-VN')}</span>
            {lastUpdated && (
              <>
                <span className="h-3 w-px bg-slate-200" />
                <span className="text-slate-400">
                  Đồng bộ {lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới dữ liệu
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold">Không thể tải đầy đủ dữ liệu dashboard</p>
            <p className="mt-1 text-xs leading-5 text-red-600">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="shrink-0 text-xs font-black underline underline-offset-4"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Main overview */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Total learning content */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#143d2b] text-white shadow-[0_22px_60px_rgba(20,61,43,0.2)] xl:col-span-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-brand-yellow/10 blur-3xl" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200/80">
                  <Layers3 className="h-4 w-4" />
                  Tổng bài tập &amp; học liệu
                </div>

                <div className="mt-4 flex items-end gap-3">
                  {isLoading ? (
                    <StatSkeleton className="h-14 w-36" />
                  ) : (
                    <span className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                      {numberFormatter.format(totalLearningItems)}
                    </span>
                  )}
                  <span className="pb-1.5 text-sm font-bold text-white/[0.55]">nội dung</span>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                  Tổng hợp từ ba phân hệ học liệu chính. Mỗi mục bên dưới hiển thị số lượng và tỷ trọng trong toàn hệ thống.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white/70 backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Dữ liệu trực tiếp
              </div>
            </div>

            <div className="mt-7 grid gap-3 lg:grid-cols-3">
              {contentGroups.map((item) => {
                const Icon = item.icon;
                const percentage = getPercentage(item.value);

                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.11]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${item.iconClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-white/30 transition group-hover:text-white/80" />
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-white">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/[0.45]">
                          {item.description}
                        </p>
                      </div>

                      {isLoading ? (
                        <StatSkeleton className="h-8 w-12 shrink-0" />
                      ) : (
                        <span className="shrink-0 text-2xl font-black tracking-tight text-white">
                          {numberFormatter.format(item.value)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-white/[0.45]">
                        <span>Tỷ trọng</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User overview */}
        <div className="flex flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 xl:col-span-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                Tổng tài khoản
              </p>
              <div className="mt-3 flex items-end gap-2">
                {isLoading ? (
                  <div className="h-11 w-24 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                  <span className="text-4xl font-black tracking-[-0.04em] text-slate-950">
                    {numberFormatter.format(normalizedStats.totalUsers)}
                  </span>
                )}
                <span className="pb-1 text-xs font-bold text-slate-400">người dùng</span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="my-6 h-px bg-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Activity className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-700">Trạng thái dữ liệu</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Kết nối API quản trị</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${errorMsg ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                {errorMsg ? 'Có lỗi' : 'Ổn định'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-700">Quản trị viên hiện tại</p>
                  <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-slate-400" title={user?.email}>
                    {user?.fullName || user?.email || 'Admin'}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                Admin
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                <Database className="h-4 w-4 text-brand-green" />
                Phạm vi thống kê
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Số liệu được tổng hợp từ các phân hệ hiện có và cập nhật mỗi khi bạn tải lại dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Management shortcuts */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-green">Quản trị học liệu</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Truy cập nhanh từng phân hệ</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Chọn một phân hệ để xem danh sách, tạo mới hoặc chỉnh sửa nội dung.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">03 phân hệ đang hoạt động</span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {contentGroups.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                to={item.href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-green/30 hover:bg-emerald-50/30 hover:shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-brand-green">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-black text-slate-800">{item.title}</p>
                    <span className="text-lg font-black text-slate-950">
                      {isLoading ? '—' : numberFormatter.format(item.value)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-slate-400">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-green" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity area */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm xl:col-span-8">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-green" />
                <h2 className="text-base font-black text-slate-950">Nhật ký hoạt động gần đây</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Theo dõi các thao tác thêm, sửa và xóa nội dung của quản trị viên.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {recentLogs.length} bản ghi mới nhất
            </span>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-xs font-semibold text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin text-brand-green" />
                Đang tải nhật ký hoạt động...
              </div>
            ) : (
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                    <th className="px-6 py-3.5">Thời gian</th>
                    <th className="px-4 py-3.5">Quản trị viên</th>
                    <th className="px-4 py-3.5 text-center">Thao tác</th>
                    <th className="px-4 py-3.5">Phân hệ</th>
                    <th className="px-6 py-3.5">Nội dung chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log) => {
                      const dateTime = formatDateTime(log.createdAt);
                      const action = ACTION_STYLES[log.actionType] || {
                        label: log.actionType || 'Khác',
                        className: 'border-slate-200 bg-slate-50 text-slate-600',
                      };
                      const module = MODULE_STYLES[log.module] || {
                        label: log.module || 'Hệ thống',
                        className: 'border-slate-200 bg-slate-50 text-slate-600',
                      };

                      return (
                        <tr key={log._id} className="group transition hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <Clock className="h-3.5 w-3.5" />
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-700">{dateTime.time}</p>
                                <p className="mt-0.5 text-[10px] text-slate-400">{dateTime.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[180px] px-4 py-4">
                            <p className="truncate text-xs font-extrabold text-slate-700" title={log.adminId?.email}>
                              {log.adminId?.fullName || 'Hệ thống'}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] text-slate-400">
                              {log.adminId?.email || 'Tự động'}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${action.className}`}>
                              {action.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[9px] font-extrabold ${module.className}`}>
                              {module.label}
                            </span>
                          </td>
                          <td className="max-w-[320px] px-6 py-4">
                            <p className="truncate text-xs font-medium text-slate-500" title={log.details}>
                              {log.details || 'Không có mô tả chi tiết'}
                            </p>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <ShieldAlert className="h-9 w-9 opacity-40" />
                          <p className="text-sm font-bold text-slate-500">Chưa có hoạt động quản trị</p>
                          <p className="text-xs">Các thao tác mới sẽ xuất hiện tại đây.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <aside className="space-y-5 xl:col-span-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Cơ cấu thao tác
                </p>
                <h2 className="mt-1 text-base font-black text-slate-950">Trong {recentLogs.length} hoạt động gần nhất</h2>
              </div>
              <Activity className="h-5 w-5 text-brand-green" />
            </div>

            <div className="mt-5 space-y-3">
              {Object.entries(ACTION_STYLES).map(([key, action]) => {
                const count = activitySummary[key];
                const percentage = recentLogs.length ? Math.round((count / recentLogs.length) * 100) : 0;

                return (
                  <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${key === 'CREATE' ? 'bg-emerald-500' : key === 'UPDATE' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-extrabold text-slate-700">{action.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{count}</span>
                        <span className="ml-1 text-[10px] font-bold text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-brand-yellow" />
              <h2 className="text-sm font-black">Ghi chú vận hành</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-white/[0.55]">
              Hệ thống lưu lại các thao tác nhạy cảm để hỗ trợ kiểm tra và truy vết dữ liệu. Hãy rà soát nhật ký khi phát hiện nội dung thay đổi bất thường.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Khuyến nghị</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/75">
                Kiểm tra kỹ nội dung trước khi xóa vì thao tác này có thể ảnh hưởng trực tiếp tới dữ liệu học tập đang sử dụng.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}