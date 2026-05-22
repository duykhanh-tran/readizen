import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import FeatureCard from '../components/shared/FeatureCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import CTABanner from '../components/shared/CTABanner.jsx';
import FAQSection from '../components/shared/FAQSection.jsx';
import { faqProduct } from '../data/faqData.js';

export default function Product() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBuyClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/profile', { state: { activeTab: 'consult' } });
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-brand-cream min-h-screen selection:bg-brand-light/40 overflow-x-hidden">
      <Header />
      
      {/* ================= SECTION 1: HERO ================= */}
      <header 
        className="relative overflow-hidden text-left"
        style={{ background: 'radial-gradient(circle at 10% 20%, #FFF9EB 0%, transparent 40%), radial-gradient(circle at 90% 80%, #E6F4EA 0%, transparent 40%), #FAF7EE' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 text-brand-green text-xs font-bold uppercase tracking-wider mb-4">
              Readizen Set 1 - Điểm bắt đầu cho trẻ 5+
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Bộ 5 truyện đầu tiên<br/>để con bắt đầu luyện<br/>đọc tiếng Anh
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-lg leading-relaxed">
              Readizen Set 1 giúp trẻ 5+ bắt đầu đọc truyện tiếng Anh tại nhà bằng 5 câu chuyện vừa sức, app đọc mẫu, AI feedback, hoạt động nói lại và phản hồi giáo viên sau khi đọc.
            </p>

            {/* Price Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 inline-flex items-center gap-4 mb-8">
              <span className="font-bold text-xl text-gray-900">250.000đ <span className="text-sm font-normal text-gray-600">/ Set 1</span></span>
              <div className="w-px h-6 bg-yellow-300"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 line-through">375.000đ nếu mua lẻ</span>
                <span className="text-xs font-bold text-orange-600">Tiết kiệm 125.000đ</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button 
                onClick={handleBuyClick} 
                className="bg-brand-green hover:bg-brand-dark transition text-white px-8 py-3.5 rounded-full font-bold text-center text-sm shadow-lg cursor-pointer"
              >
                Mua ngay
              </button>
              <Link to="/learn" className="bg-white hover:bg-gray-50 transition text-brand-green font-bold px-8 py-3.5 rounded-full text-center border border-gray-200 shadow-sm text-sm">
                Xem con sẽ học như thế nào
              </Link>
            </div>
            <p className="text-xs text-gray-500 max-w-md">
              Phù hợp cho trẻ 5+ mới bắt đầu hoặc chưa có thói quen đọc truyện tiếng Anh tại nhà.
            </p>
          </div>

          {/* Right Column: Simulated Image Block */}
          <div className="relative z-10 w-full flex items-center justify-center lg:justify-end">
            <div className="absolute inset-4 lg:inset-8 border border-dashed border-blue-300 rounded-[2rem] z-0"></div>

            {/* Main box */}
            <div className="relative z-10 w-full max-w-md bg-white border-4 border-brand-yellow rounded-3xl p-3 shadow-2xl flex flex-col transform hover:-translate-y-2 transition duration-500 text-left">
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden relative mb-3">
                <SafeImage 
                  src="/assets/home2.jpg" 
                  alt="Bộ sách Readizen Set 1" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20 flex items-end p-4">
                  <span className="text-white font-bold text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    5 truyện • App đọc mẫu • AI feedback • Teacher feedback
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 h-32 relative">
                <div className="bg-brand-dark rounded-xl p-3 text-white flex flex-col relative overflow-hidden">
                  <h4 className="font-bold text-xs mb-1">App đi kèm sách</h4>
                  <p className="text-[9px] text-gray-300 opacity-80 leading-tight">Listen • Read • Record • AI Feedback</p>
                  <div className="mt-auto self-end bg-gray-800 rounded w-16 h-12 flex items-center justify-center border border-gray-700">📱</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col">
                  <h4 className="font-bold text-xs text-gray-900 mb-1">Feedback sau khi đọc</h4>
                  <p className="text-[9px] text-gray-500 leading-tight">Con nói lại điều đã hiểu và nhận nhận xét.</p>
                  <span className="mt-auto text-[10px] font-bold text-brand-green bg-brand-light self-start px-2 py-1 rounded">Con dùng được câu</span>
                </div>

                <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-48 z-30">
                  <h4 className="font-bold text-brand-green text-xs mb-1">Không chỉ là 5 cuốn sách</h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed">Đây là bộ khởi đầu gồm sách giấy, app luyện đọc, hoạt động nói lại và phản hồi sau khi đọc.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ================= SECTION 4: 5 CUỐN TRUYỆN TRONG SET ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="5 cuốn truyện trong Set 1"
            title="Set 1 - Chủ đề tự nhiên"
            subtitle="Mỗi cuốn giúp con luyện đọc một câu chuyện ngắn, học từ vựng trong bối cảnh, làm một nhiệm vụ nhỏ và nói lại điều đã hiểu."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="w-full aspect-[3/4] bg-gray-900 rounded-2xl mb-4 overflow-hidden shadow-md border-4 border-brand-yellow relative">
                  <SafeImage 
                    src={`/assets/home2.jpg`} 
                    alt={`Bìa sách ${item}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-brand-green transition">The Little Tree</h4>
                <div className="text-xs text-gray-500 space-y-1 mb-2">
                  <div className="font-bold text-gray-700">Từ mới</div>
                  <div className="flex items-start gap-1"><span className="text-brand-green">~</span> Light, Star, Moon ...</div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="font-bold text-gray-700">Hội thoại</div>
                  <div>• What is this?</div>
                  <div>• It's a light</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ================= SECTION 3: TRONG SET 1 CÓ GÌ ================= */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Trong Set 1 có gì?"
            title="Readizen Set 1 có gì?"
            subtitle="Set 1 không chỉ là 5 cuốn truyện. Phụ huynh nhận sách giấy, mã kích hoạt app học tập và phần hỗ trợ cần thiết để biết cách bắt đầu luyện đọc cùng con."
          />

          <div className="border-2 border-solid border-blue-400 rounded-[2rem] p-6 lg:p-10 bg-brand-cream shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 z-0"></div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-xl">📗</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">5 cuốn truyện, bản in Cao cấp</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Truyện ngắn, tranh màu, câu vừa sức cho trẻ 5+, có hoạt động đọc hiểu và nói lại trong từng cuốn.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-xl">📱</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Mã kích hoạt App Readizen</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Kích hoạt nội dung Set 1 trên app để con nghe mẫu, luyện đọc, ghi âm, nhận phản hồi và theo dõi tiến trình.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 text-xl">✨</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Teacher Support</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Ba mẹ được hướng dẫn cách bắt đầu tại nhà; giáo viên hỗ trợ nhận xét phần con nói lại câu chuyện theo phạm vi của Set 1.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: CẤU TRÚC 5 HỌC PHẦN ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Con học một cuốn thế nào?"
            title="5 học phần trong sách"
            subtitle="Điểm đầu vào là các từ vựng, và kết thúc đầu ra là hoạt động luyện thuyết trình có feedback."
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center mb-10">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">🔤</div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Vocab</h4>
              <p className="text-[10px] text-gray-500">Con làm quen từ mới qua tranh và app đọc mẫu.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">📚</div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Story</h4>
              <p className="text-[10px] text-gray-500">Con đọc câu chuyện ngắn trong sách giấy.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">🌍</div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Impact</h4>
              <p className="text-[10px] text-gray-500">Con trả lời câu hỏi hoặc làm nhiệm vụ nhỏ.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-3">💬</div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Speak</h4>
              <p className="text-[10px] text-gray-500">Con thực hành hội thoại cùng ba mẹ.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center col-span-2 md:col-span-1">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">🎤</div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Presentation</h4>
              <p className="text-[10px] text-gray-500">Con nói lại điều đã hiểu và nhận phản hồi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: SO SÁNH TRƯỚC KHI MUA ================= */}
      <section className="bg-brand-cream py-12 text-center">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="So sánh trước khi mua"
            title="6 điểm khác biệt của Set 1"
            subtitle="Bạn không chỉ mua thêm sách. Bạn bắt đầu cho con một cách đọc có hướng dẫn."
          />

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm text-left mb-12">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-dark text-white text-left">
                  <th className="w-1/2 p-5 font-bold border-r border-brand-darker">Mua sách tiếng Anh thông thường</th>
                  <th className="w-1/2 p-5 font-bold text-brand-yellow">Sách Readizen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-5 border-b border-r border-gray-100 text-gray-600">Phụ huynh tự tìm cách đọc cùng con.</td>
                  <td className="p-5 border-b border-gray-100 font-bold text-brand-green bg-brand-cream/30">Có quy trình 5 bước trong từng cuốn.</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-gray-100 text-gray-600">Con không biết phát âm thế nào.</td>
                  <td className="p-5 border-b border-gray-100 font-bold text-brand-green bg-brand-cream/30">Có app đọc mẫu.</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-gray-100 text-gray-600">Đọc xong là hết.</td>
                  <td className="p-5 border-b border-gray-100 font-bold text-brand-green bg-brand-cream/30">Có Speak và Presentation.</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-gray-100 text-gray-600">Không rõ con hiểu được gì.</td>
                  <td className="p-5 border-b border-gray-100 font-bold text-brand-green bg-brand-cream/30">Có quiz/nhiệm vụ và feedback.</td>
                </tr>
                <tr>
                  <td className="p-5 border-b border-r border-gray-100 text-gray-600">Dễ bỏ dở sau vài ngày.</td>
                  <td className="p-5 border-b border-gray-100 font-bold text-brand-green bg-brand-cream/30">Có XP, Hạt Giống và Green Map.</td>
                </tr>
                <tr>
                  <td className="p-5 border-r border-gray-100 text-gray-600">Phụ huynh khó theo dõi.</td>
                  <td className="p-5 font-bold text-brand-green bg-brand-cream/30">Có tiến trình học trên app.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-brand-green rounded-[2rem] p-10 lg:p-16 text-center text-white relative shadow-xl">
            <svg className="w-16 h-16 opacity-20 absolute top-8 left-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <div className="flex flex-col items-center justify-center mb-6 relative z-10">
              <div className="w-16 h-16 bg-gray-300 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                <SafeImage src="/assets/home2.jpg" alt="Avatar" className="w-full h-full object-cover" /> 
              </div>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold mb-4 relative z-10 text-white">Hình thành thói quen đọc sách</h3>
            <p className="text-brand-light text-sm max-w-2xl mx-auto relative z-10 leading-relaxed">
              Luyện đọc sách tiếng Anh không chỉ là phương pháp tuyệt vời để cải thiện kỹ năng đọc và nói cho con. Mà còn hình thành cho con một trong những thói quen quan trọng nhất của mỗi con người là Đọc Sách.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: DẤU HIỆU CẦN ================= */}
      <section className="bg-white py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Set 1 dành cho ai?"
            title="Dấu hiệu con cần Readizen Set 1"
            subtitle="Section này giúp phụ huynh tự xác định con có hợp bộ khởi đầu này không trước khi ra quyết định mua."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">01</div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-4 text-lg">📚</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Chưa tự đọc truyện</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Con biết một số từ hoặc mẫu câu, nhưng khi mở truyện tiếng Anh vẫn cần người hướng dẫn.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">02</div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-lg">🧩</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Có sách nhưng ít đọc</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Sách có thể đẹp, nhưng nếu không có cách bắt đầu, con dễ bỏ dở.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">03</div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-lg">🎧</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Ba mẹ ngại phát âm</h4>
                <p className="text-gray-500 text-xs leading-relaxed">App hỗ trợ phần đọc mẫu để phụ huynh dễ đồng hành hơn.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">04</div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 text-lg">🖼️</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Cần truyện vừa sức</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Ở giai đoạn đầu, cảm giác "con đọc được" quan trọng hơn đọc thật nhiều.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-2 text-7xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">05</div>
              <div className="relative z-10">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-4 text-lg">💬</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm">Muốn con nói nhiều</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Set 1 có Speak và Presentation để con có đầu ra sau mỗi cuốn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: THỰC TẾ HOẠT ĐỘNG (ASSETS) ================= */}
      <section className="bg-white py-16 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className=" rounded-3xl p-8 lg:p-12 relative bg-white">
            <div className="text-center mb-12">
              <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                Demo & Hình ảnh thật
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Thực tế hoạt động Readizen Set 1
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                Khi public, thay đường dẫn assets bằng ảnh sản phẩm Readizen thật.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden">
                  <SafeImage src="/assets/home2.jpg" alt="Ảnh sách thật" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Ảnh bộ sách thật</h4>
                <p className="text-gray-500 text-[10px] mb-3 flex-grow">Cho phụ huynh thấy sản phẩm vật lý.</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-1 rounded w-max">Asset thật</span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden">
                  <SafeImage src="/assets/home1.jpg" alt="Trang sách" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Trang sách mẫu</h4>
                <p className="text-gray-500 text-[10px] mb-3 flex-grow">Cho thấy câu ngắn, tranh rõ, nội dung vừa sức.</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-1 rounded w-max">Asset thật</span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden">
                  <SafeImage src="/assets/home3.png" alt="Video bé học" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Video bé học</h4>
                <p className="text-gray-500 text-[10px] mb-3 flex-grow">Mở sách, nghe app, đọc lại, nói lại.</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-1 rounded w-max">Video/GIF</span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden">
                  <SafeImage src="/assets/about2.png" alt="UI App" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Screenshot app</h4>
                <p className="text-gray-500 text-[10px] mb-3 flex-grow">My Bookshelf, AI Reading, Presentation, Green Map.</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-1 rounded w-max">App screenshot</span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="w-full aspect-[4/3] rounded-xl mb-4 overflow-hidden">
                  <SafeImage src="/assets/home2.jpg" alt="Feedback" className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Feedback mẫu</h4>
                <p className="text-gray-500 text-[10px] mb-3 flex-grow">Giáo viên nhận xét bài Presentation.</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2 py-1 rounded w-max">Feedback thật</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: CHÍNH SÁCH HỖ TRỢ ================= */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Chính sách & hỗ trợ"
            title="Phụ huynh được hỗ trợ khi bắt đầu"
            subtitle="Quy trình minh bạch và nhanh chóng giúp ba mẹ an tâm khi đồng hành học cùng con."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-start">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">🚚</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Giao hàng</h4>
              <p className="text-gray-500 text-xs">Giao bộ sách đến tận nhà. Thời gian giao hàng tùy khu vực.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-start">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">📱</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Kích hoạt app</h4>
              <p className="text-gray-500 text-xs">Phụ huynh được hướng dẫn cách kích hoạt app đi kèm Set 1.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-start">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">🤝</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Hỗ trợ sử dụng</h4>
              <p className="text-gray-500 text-xs">Hướng dẫn cách cho con bắt đầu buổi đọc đầu tiên.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-start">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">🔄</div>
              <h4 className="font-bold text-brand-green mb-2 text-sm">Chính sách đổi trả</h4>
              <p className="text-gray-500 text-xs">Áp dụng theo chính sách sản phẩm và tình trạng đơn hàng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FAQ MUA HÀNG ================= */}
      <FAQSection
        badge="FAQ mua hàng"
        title="Câu hỏi thường gặp"
        items={faqProduct}
      />

      {/* ================= SECTION 11: FINAL CTA ================= */}
      <CTABanner
        title="Sẵn sàng để con bắt đầu đọc truyện tiếng Anh có hướng dẫn?"
        subtitle="Readizen Set 1 giúp con bắt đầu bằng 5 câu chuyện vừa sức, app đọc mẫu, AI feedback, hoạt động nói lại và phản hồi sau khi đọc."
        primaryText="Mua Readizen Set 1"
        primaryOnClick={handleBuyClick}
        secondaryText="Tư vấn con có phù hợp không?"
        secondaryHref="/learn"
      />
      
      <Footer />
    </div>
  );
}