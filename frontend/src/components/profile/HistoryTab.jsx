import React from 'react';
import { Clock, FileText } from 'lucide-react';

export default function HistoryTab({ myForms, isLoadingHistory }) {
  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-50 text-blue-800 border-blue-200',
    canceled: 'bg-red-50 text-red-800 border-red-200',
  };

  const statusLabels = {
    pending: 'Chờ liên hệ',
    contacted: 'Đang tư vấn',
    canceled: 'Đã hủy',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
      <h3 className="font-black text-gray-800 text-[15px] mb-4 flex items-center gap-2">
        <Clock className="w-4.5 h-4.5 text-brand-green" />
        <span>Lịch sử đăng ký tư vấn</span>
      </h3>

      {isLoadingHistory ? (
        <div className="py-12 text-center text-gray-400 text-xs">
          <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span>Đang lấy lịch sử...</span>
        </div>
      ) : myForms.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {myForms.map((item) => (
            <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-gray-800 text-sm">{item.courseInterest}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[item.status] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">SĐT: {item.phone} • Trình độ: {item.currentLevel}</p>
                {item.message && <p className="text-xs text-gray-500 mt-2 bg-brand-cream/50 p-2.5 rounded-xl border border-gray-100">{item.message}</p>}
              </div>
              <div className="text-[10px] text-gray-400 shrink-0 font-mono">
                {new Date(item.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-25" />
          <p className="text-xs font-semibold">Chưa có lịch sử yêu cầu tư vấn nào.</p>
        </div>
      )}
    </div>
  );
}
