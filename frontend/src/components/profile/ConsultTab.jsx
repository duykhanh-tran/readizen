import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import api from '../../services/axios.js';

export default function ConsultTab({ onSuccess }) {
  // Submit Form State
  const [phone, setPhone] = useState('');
  const [courseInterest, setCourseInterest] = useState('Readizen Set 1');
  const [currentLevel, setCurrentLevel] = useState('Chưa biết tiếng Anh');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Submit Consultation Form Handler
  const handleSendForm = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmittingForm(true);

    if (!phone) {
      setFormError('Vui lòng nhập số điện thoại.');
      setIsSubmittingForm(false);
      return;
    }

    try {
      await api.post('/forms/submit', {
        phone,
        courseInterest,
        currentLevel,
        message
      });
      setFormSuccess('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
      setPhone('');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gửi form thất bại.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-left">
      <h3 className="font-black text-gray-800 text-[16px] mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-brand-green" />
        <span>Đăng ký tư vấn lộ trình học</span>
      </h3>
      <p className="text-gray-500 text-xs mb-6">
        Ba mẹ nhập số điện thoại và thông tin trình độ hiện tại của bé để được các thầy cô chuyên môn gọi điện tư vấn.
      </p>

      <form onSubmit={handleSendForm} className="space-y-4">
        {formError && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}
        {formSuccess && (
          <div className="bg-green-50 text-green-700 text-xs p-4 rounded-xl border border-green-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{formSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Số điện thoại phụ huynh
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Khóa học quan tâm
            </label>
            <select
              value={courseInterest}
              onChange={(e) => setCourseInterest(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold text-gray-700 cursor-pointer bg-white"
            >
              <option value="Readizen Set 1">Readizen Set 1</option>
              <option value="Readizen Set 2">Readizen Set 2</option>
              <option value="Readizen Set 3">Readizen Set 3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Trình độ hiện tại của bé
          </label>
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:outline-none text-xs font-semibold text-gray-700 cursor-pointer bg-white"
          >
            <option value="Chưa biết tiếng Anh">Chưa biết tiếng Anh (Mới bắt đầu)</option>
            <option value="Biết từ đơn lẻ">Biết một số từ vựng đơn giản</option>
            <option value="Nói được câu ngắn">Đã nói được câu ngắn/đơn giản</option>
            <option value="Nói trôi chảy">Nói lưu loát câu chuyện dài</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Lời nhắn / Mô tả chi tiết
          </label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mô tả cụ thể mong muốn của ba mẹ..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-brand-green focus:ring-2 focus:ring-brand-light focus:outline-none text-xs"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmittingForm}
          className="bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs ml-auto"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmittingForm ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
        </button>
      </form>
    </div>
  );
}
