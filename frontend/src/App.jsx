import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SafeImage from './components/shared/SafeImage.jsx';
import FeatureCard from './components/shared/FeatureCard.jsx';
import SectionHeader from './components/shared/SectionHeader.jsx';
import CTABanner from './components/shared/CTABanner.jsx';
import FAQSection from './components/shared/FAQSection.jsx';
import { faqHome } from './data/faqData.js';

export function App() {
  const heroImages = [
    '/assets/m1.jpg',
    '/assets/about1.webp',
    '/assets/m4.png'
  ];
  const comparisons = [
    {
      old: "Phụ huynh và con tự tìm cách đọc",
      new: "Có quy trình đọc từng bước.",
    },
    {
      old: "Không biết thế nào là đúng, là sai",
      new: "Có App và Giáo viên phản hồi",
    },
    {
      old: "Chỉ có hoạt động đọc",
      new: "Hoạt động: Đọc, Nói và Tương tác",
    },
    {
      old: "Thiếu động lực đọc tiếp",
      new: "Đọc để phủ xanh các vùng đất",
    },
  ];
  const [currentHeroBgIndex, setCurrentHeroBgIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-16 lg:py-24 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroBgIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <SafeImage
                src={src}
                alt="Readizen Hero Background"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-base font-bold mb-4 shadow-sm">
              <Check className="w-5 h-5" />
              Readizen — Small Readers, Big Citizens
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Sách đọc tiếng Anh<br />
              tại nhà cho trẻ 5+ <br />
            </h1>

            <p className="text-xl lg:text-2xl text-gray-800 mb-4 max-w-2xl leading-relaxed font-medium">
              Readizen là sách đọc tiếng Anh thế hệ mới.
              Giúp phụ huynh và con nâng cao kỹ năng đọc, nói tiếng Anh ngay tại nhà.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/library"
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Bắt đầu với Set 1
              </Link>
              <Link
                to="/practice"
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Luyện đọc Tiếng Anh là gì?
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SECTION 2: VÌ SAO NÊN LUYỆN ĐỌC ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="w-full aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center">
            <SafeImage
              src="/assets/home5.jpg"
              alt="Hộp sách Readizen"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <SectionHeader
              badge="Nền tảng học Tiếng Anh"
              title="Vì sao con nên đọc truyện tiếng Anh? "
              align="left"
              className="mb-6"
            />
            <p className="text-gray-600 mb-8 text-lg">
              Các câu chuyện đưa tiếng Anh vào bối cảnh cụ thể, ở đó có tranh, nhân vật, hành động và cảm xúc. Nhờ đó, con không chỉ học thêm từ mới mà còn hiểu cách dùng từ, quen với mẫu câu và có nội dung để nói lại bằng tiếng Anh.            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Từ vựng đặt trong ngữ cảnh</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Mẫu câu quen thuộc</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Câu truyện giúp con ghi nhớ</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: VẤN ĐỀ THỰC SỰ & TESTIMONIAL ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-5">
              <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                Vấn đề của con
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Khó khăn khi con tự đọc
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Với trẻ mới bắt đầu, vấn đề không phải là thiếu sách mà là con không chọn được sách phù hợp và các hướng dẫn cần thiết để đọc chủ động và hiệu quả.              </p>
              <Link to="/practice" className="inline-flex items-center text-brand-green font-bold hover:text-brand-dark transition-colors">
                Tìm hiểu truyện đọc có hướng dẫn
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                emoji="📚"
                title="Không đúng trình độ"
                description="Nếu câu dài, từ khó hoặc tranh không rõ, con dễ nản ngay từ những trang đầu tiên."
                iconBg="bg-red-50"
                iconBorder="border-red-100"
              />
              <FeatureCard
                emoji="🎧"
                title="Thiếu đọc mẫu"
                description="Con không biết âm thanh của câu nên dễ ngại đọc thành tiếng."
                iconBg="bg-blue-50"
                iconBorder="border-blue-100"
              />
              <FeatureCard
                emoji="✨"
                title="Thiếu phản hồi"
                description="Phụ huynh không chắc con đọc đúng chưa, cần sửa gì hoặc đã tiến bộ ở đâu."
                iconBg="bg-yellow-50"
                iconBorder="border-yellow-100"
              />
              <FeatureCard
                emoji="💬"
                title="Thiếu động lực"
                description="Nếu không có hoạt động nói lại, reading khó đổi sang speaking."
                iconBg="bg-purple-50"
                iconBorder="border-purple-100"
              />
            </div>
          </div>

          <div className="bg-brand-green rounded-[2rem] p-10 lg:p-16 text-center text-white relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-4 left-4 text-9xl text-white/10 font-serif pointer-events-none select-none">“</div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 relative z-10">Con cần giải pháp mới để có thể tự đọc truyện tiếng Anh</h3>
            <p className="text-brand-light text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Với mỗi câu truyện, con cần được nghe mẫu, thực hành, nhận phản hồi cho bài đọc để việc đọc trở nên hào hứng và hiệu quả hơn.            </p>
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 border-2 border-white overflow-hidden shadow-md">
                <SafeImage src="/assets/home6.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-white">Teacher Mai Linh</span>
              <p className="text-brand-light text-sm opacity-80">Readizen's Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: SO SÁNH SÁCH THƯỜNG VS SÁCH READIZEN ================= */}
      <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden font-sans">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center relative z-10">

          <SectionHeader
            badge="Sách đọc tiếng Anh"
            title="Sách thường vs Sách Readizen"
            subtitle="Sách thường để phụ huynh và con tự đọc. Sách Readizen cung cấp giải pháp từng bước giúp mọi phụ huynh và con có thể tự luyện đọc tiếng Anh tại nhà thành công."
          />

          <div className="relative mt-12 mb-10 flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-center">

            {/* Badge "VS" nằm giữa 2 thẻ (Chỉ đè lên trên ở Desktop, Mobile sẽ nằm giữa 2 khối) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center font-black text-gray-300 border border-gray-100">
              VS
            </div>

            {/* === THẺ 1: SÁCH THƯỜNG (Bên trái) === */}
            <div className="w-full md:w-1/2 bg-white md:bg-gray-50/50 rounded-3xl md:rounded-r-none md:rounded-l-3xl p-6 lg:p-10 border border-gray-200 shadow-sm md:shadow-none transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-500 mb-8 pb-4 border-b border-gray-200">
                Sách tiếng Anh thông thường
              </h3>
              <ul className="space-y-6">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-left group">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red-50 transition-colors">
                      <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400" />
                    </div>
                    <span className="text-gray-600 font-medium">{item.old}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* === THẺ 2: SÁCH READIZEN (Bên phải - Nổi bật hơn) === */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl p-6 lg:p-10 shadow-xl border-2 border-brand-green relative z-10 transform md:scale-105 hover:-translate-y-1 transition-all duration-500">
              {/* Tag vương miện/Highlight */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
                Giải pháp tối ưu
              </div>

              <h3 className="text-2xl font-black text-brand-green mb-8 pb-4 border-b border-gray-100 flex items-center justify-center gap-2">
                Readizen
              </h3>

              <ul className="space-y-6">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-left group cursor-default">
                    <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-brand-green/20 group-hover:scale-110 transition-transform">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-900 font-extrabold group-hover:text-brand-green transition-colors">
                      {item.new}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="mt-12">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 bg-white px-8 py-4 rounded-full text-brand-green font-black shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-brand-green/30 transition-all duration-300"
            >
              Tìm hiểu cách Readizen hoạt động
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= SECTION 5 & 6: QUY TRÌNH LUYỆN ĐỌC KHOA HỌC ================= */}
      <section className="bg-brand-cream py-20 lg:py-32 overflow-hidden relative font-sans">

        {/* Background Decorators (Tạo không gian học thuật nhẹ nhàng) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-green/5 blur-[120px]"></div>
          <div className="absolute top-[60%] -right-[10%] w-[30%] h-[50%] rounded-full bg-brand-yellow/5 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">

          {/* Phần Header đã được tinh chỉnh nội dung để bao hàm cả 2 ý nghĩa */}
          <SectionHeader
            badge="Hệ sinh thái học tập 3-trong-1"
            title="Quy trình luyện đọc chuẩn Khoa học"
            subtitle="Sự kết hợp hoàn hảo giữa Sách giấy truyền thống, Công nghệ App thông minh và sự đồng hành của Giáo viên, giúp trẻ tự tin chinh phục tiếng Anh tại nhà."
          />

          <div className="relative mt-8 sm:mt-20">

            {/* Đường dẫn kết nối "Dòng chảy học tập" (Hiện từ màn hình tablet trở lên) */}
            <div className="hidden md:block absolute top-[2rem] lg:top-[2.5rem] left-[16%] right-[16%] z-0">
              {/* Nét đứt */}
              <div className="w-full h-0 border-t-[3px] border-dashed border-gray-300 relative"></div>
              {/* Hiệu ứng ánh sáng chạy dọc theo đường line */}
              <div className="absolute top-[-2px] left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-brand-green to-transparent opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10">

              {/* ================= THẺ BƯỚC 1: BEFORE (APP) ================= */}
              <div
                className="relative pt-10 lg:pt-12 group cursor-pointer max-w-sm mx-auto md:max-w-none w-full"
                onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
              >
                {/* Con số chỉ mục nổi lên trên */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-30"></div>
                    <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-dark">
                      1
                    </div>
                  </div>
                </div>

                {/* Thẻ nội dung chính (Ảnh nền + Kính mờ) */}
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">

                  {/* Ảnh App */}
                  <SafeImage src="/assets/home3.webp" alt="Học với App" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                  {/* Gradient phủ xanh thương hiệu từ dưới lên */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/65 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>

                  {/* Nội dung text nổi */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                    <div className="mb-auto mt-6">
                      <h4 className="font-black text-brand-yellow text-xs sm:text-sm uppercase tracking-widest mb-1">Bước 1: Before</h4>

                    </div>

                    {/* Nhãn công cụ (Badge) */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-xs sm:text-sm font-bold w-fit mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                      <span className="text-lg">📱</span> App Học tập
                    </div>

                    {/* Mô tả chi tiết (Hiệu ứng Slide up) */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeStep === 1 ? 'max-h-[150px] opacity-100' : 'max-h-[80px] opacity-100 lg:max-h-0 lg:opacity-0 group-hover:max-h-[150px] group-hover:opacity-100'}`}>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-4 mt-1 font-sans">
                        Thay vì tự đoán cách đọc, con làm quen từ mới, nghe âm thanh chuẩn bản xứ và cấu trúc câu thông qua App trước khi mở sách.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= THẺ BƯỚC 2: READING (SÁCH GIẤY) ================= */}
              <div
                className="relative pt-10 lg:pt-12 group cursor-pointer max-w-sm mx-auto md:max-w-none w-full"
                onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-30" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-dark">
                      2
                    </div>
                  </div>
                </div>

                <div className="relative bg-white rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">

                  {/* Ảnh Sách giấy */}
                  <SafeImage src="/assets/home1.jpg" alt="Học với Sách" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/65 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>

                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                    <div className="mb-auto mt-6">
                      <h4 className="font-black text-brand-yellow text-xs sm:text-sm uppercase tracking-widest mb-1">Bước 2: Read</h4>

                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-xs sm:text-sm font-bold w-fit mb-4 group-hover:-translate-y-1 transition-transform duration-500">
                      <span className="text-lg">📚</span> Sách Giấy
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeStep === 2 ? 'max-h-[150px] opacity-100' : 'max-h-[80px] opacity-100 lg:max-h-0 lg:opacity-0 group-hover:max-h-[150px] group-hover:opacity-100'}`}>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-4 mt-1 font-sans">
                        Con chìm đắm vào câu chuyện với sách giấy, tranh vẽ sinh động tạo cảm hứng. App lúc này đóng vai trò người dẫn truyện đồng hành.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= THẺ BƯỚC 3: AFTER (APP & GIÁO VIÊN) ================= */}
              <div
                className="relative pt-10 lg:pt-12 group cursor-pointer max-w-sm mx-auto md:max-w-none w-full"
                onClick={() => setActiveStep(activeStep === 3 ? null : 3)}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-green rounded-full animate-ping opacity-30" style={{ animationDelay: '600ms' }}></div>
                    <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-dark">
                      3
                    </div>
                  </div>
                </div>

                <div className="relative bg-white rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100">

                  {/* Ảnh Giáo viên/Feedback */}
                  <SafeImage src="/assets/home2.jpg" alt="Đánh giá từ Giáo viên" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/65 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>

                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                    <div className="mb-auto mt-6">
                      <h4 className="font-black text-brand-yellow text-xs sm:text-sm uppercase tracking-widest mb-1">Bước 3: After</h4>

                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 group-hover:-translate-y-1 transition-transform duration-500 font-sans">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-xs sm:text-sm font-bold">
                        <span className="text-lg">👩‍🏫</span> Giáo viên
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-dark/30 backdrop-blur-md border border-brand-dark/40 text-brand-cream text-xs sm:text-sm font-bold">
                        <span className="text-lg">🤖</span> AI
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeStep === 3 ? 'max-h-[150px] opacity-100' : 'max-h-[80px] opacity-100 lg:max-h-0 lg:opacity-0 group-hover:max-h-[150px] group-hover:opacity-100'}`}>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-4 mt-1 font-sans">
                        Thực hành thu âm bài nói. Cả hệ thống Trí tuệ nhân tạo và Giáo viên thực sẽ cùng đánh giá, chấm điểm và nhận xét để con sửa lỗi tức thì.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: APP FEATURES & GREEN MAP ================= */}
      <section className="bg-gradient-to-b from-brand-green to-brand-dark py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">

            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              App Quản lý học tập
            </h2>
            <p className="text-brand-light text-lg opacity-90 max-w-2xl mx-auto">
              App được thiết kế theo nguyên tắc hỗ trợ, tăng cường hiệu quả cho sách. Giúp con luyện đọc một cách dễ dàng, chính xác và hiệu quả hơn rất nhiều.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image frame */}
            <div className="bg-white/5 rounded-[2.5rem] p-2 md:p-4 w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="w-full h-full bg-black rounded-3xl overflow-hidden relative shadow-inner">
                <SafeImage
                  src="/assets/home3.webp"
                  alt="Giao diện App Readizen"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-4 text-left">
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">My Bookshelf</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Nơi con nhìn thấy thư viện & hành trình đọc của mình.</p>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎙️</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">AI Reading</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Công nghệ giúp chấm điểm bài đọc tiêu chuẩn của con.</p>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👩‍🏫</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Show & Tell</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Con gửi lên video bài nói, nhận feedback từ Giáo viên thực.</p>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Green Map</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Ghi nhận nỗ lực và thành tích đọc của con bằng các Cây xanh.</p>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/tech" className="inline-flex justify-center w-full sm:w-auto bg-brand-yellow hover:bg-yellow-500 text-gray-900 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-1">
                  Khám phá App & Công nghệ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================= SECTION 9: READIZEN SET 1 DETAILS ================= */}
      {/* ================= SECTION 9: READIZEN SET 1 DETAILS ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* TEXT CONTAINER (Chuyển sang bên trái bằng order-2 lg:order-1) */}
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Bắt đầu từ đâu?
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Readizen Set 1<br />
              Bộ 5 truyện tiếng Anh<br />đầu tiên cho trẻ 5+
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Set 1 gồm 5 cuốn sách đầu tiên trong hệ thống sách của Readizen, giúp con bắt đầu hành trình luyện đọc tại nhà với sự trợ giúp của App và Giáo viên thực.
            </p>

            {/* Danh sách: Giảm space-y-5 thành space-y-3 để các dòng gần nhau hơn */}
            <ul className="space-y-3 mb-10 text-left">
              {/* Đã xóa bg-gray-50, p-4, rounded-2xl để bỏ nền trắng */}
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-800 font-bold text-base">5 truyện tiếng Anh ở trình độ bắt đầu.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-800 font-bold text-base">App đi kèm để nghe mẫu và luyện đọc.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-800 font-bold text-base">AI feedback và phản hồi giáo viên.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-800 font-bold text-base">Green Map, XP và Hạt Giống tạo động lực.</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-6">
              <Link to="/library" className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1">
                Xem chi tiết Set 1
              </Link>
            </div>
          </div>

          {/* IMAGE CONTAINER (Chuyển sang bên phải bằng order-1 lg:order-2) */}
          <div className="order-1 lg:order-2 w-full aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-xl border border-gray-200">
            <SafeImage src="/assets/home2.jpg" alt="Readizen Set 1" className="w-full h-full object-cover" />
          </div>

        </div>
      </section>

      {/* ================= SECTION 10: THỰC TẾ HỌC TẬP ================= */}
      <section className="bg-white py-16 lg:py-24 relative">
        {/* Đã tăng max-w-6xl lên max-w-7xl để khu vực này to và rộng rãi hơn */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">
            <SectionHeader
              badge="Hoạt động"
              title="Thực tế học tập"
              subtitle="Hình ảnh trực quan sinh động từ sản phẩm vật lý, app đồng hành và nhận xét chuyên môn thực tế."
            />
          </div>

          {/* Lưới 3 cột với khoảng cách lớn hơn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">

            {/* Card 1 */}
            <div
              onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              {/* Ảnh nền phủ kín thẻ */}
              <SafeImage
                src="/assets/home1.jpg"
                alt="Ảnh sách thật"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${activeCard === 1 ? 'scale-110' : ''
                  }`}
              />
              {/* Lớp phủ Gradient đồng nhất với hệ màu brand để làm nổi bật chữ */}
              <div className={`absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/30 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-95 ${activeCard === 1 ? 'opacity-95' : ''
                }`}></div>

              {/* Nội dung text (nằm dưới cùng) */}
              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 z-10 flex flex-col justify-end h-full">
                {/* Tiêu đề: Luôn hiện */}
                <h4 className={`font-bold text-brand-cream text-xl lg:text-2xl transition-all duration-500 ease-in-out group-hover:mb-3 group-hover:text-brand-yellow ${activeCard === 1 ? 'mb-3 text-brand-yellow' : ''
                  }`}>
                  Hoạt động đọc Sách
                </h4>

                {/* Mô tả: Bị ẩn (max-h-0, opacity-0), chỉ hiện ra khi di chuột hoặc tap trên mobile */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100 ${activeCard === 1 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="text-brand-light/90 text-sm leading-relaxed font-sans">
                    Mở trang sách và ảnh trẻ cầm sách giúp sản phẩm bớt trừu tượng.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <SafeImage
                src="/assets/home3.webp"
                alt="Giao diện App Readizen"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${activeCard === 2 ? 'scale-110' : ''
                  }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/30 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-95 ${activeCard === 2 ? 'opacity-95' : ''
                }`}></div>

              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 z-10 flex flex-col justify-end h-full">
                <h4 className={`font-bold text-brand-cream text-xl lg:text-2xl transition-all duration-500 ease-in-out group-hover:mb-3 group-hover:text-brand-yellow ${activeCard === 2 ? 'mb-3 text-brand-yellow' : ''
                  }`}>
                  Hoạt động trên app
                </h4>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100 ${activeCard === 2 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="text-brand-light/90 text-sm leading-relaxed font-sans">
                    Trẻ nghe mẫu, đọc lại, ghi âm và nhận feedback sau khi đọc.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => setActiveCard(activeCard === 3 ? null : 3)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <SafeImage
                src="/assets/home2.jpg"
                alt="Feedback mẫu"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${activeCard === 3 ? 'scale-110' : ''
                  }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-brand-darker/95 via-brand-dark/30 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-95 ${activeCard === 3 ? 'opacity-95' : ''
                }`}></div>

              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 z-10 flex flex-col justify-end h-full">
                <h4 className={`font-bold text-brand-cream text-xl lg:text-2xl transition-all duration-500 ease-in-out group-hover:mb-3 group-hover:text-brand-yellow ${activeCard === 3 ? 'mb-3 text-brand-yellow' : ''
                  }`}>
                  Giáo viên phản hồi
                </h4>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100 ${activeCard === 3 ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="text-brand-light/90 text-sm leading-relaxed font-sans">
                    Cho phụ huynh thấy giáo viên nhận xét bài Presentation như thế nào.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 11: CÓ THỂ BA MẸ QUAN TÂM ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Thông tin thêm "
            title="Có thể ba mẹ quan tâm"
            subtitle="Lựa chọn vấn đề mà bố mẹ cần tìm hiểu để bắt đầu."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 font-bold text-2xl border border-red-100">?</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Tôi chưa hiểu luyện đọc</h4>
              <p className="text-gray-500 text-sm mb-8 flex-grow">Tìm hiểu vai trò của luyện đọc trong học tập tiếng Anh.</p>
              <Link to="/practice" className="text-brand-green font-bold hover:text-brand-dark transition-colors text-sm flex items-center">
                Luyện đọc có hướng dẫn là gì? <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 font-bold text-2xl border border-blue-100">⚙️</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Readizen học thế nào</h4>
              <p className="text-gray-500 text-sm mb-8 flex-grow">Xem lộ trình học trong mỗi cuốn Readizen và cách app/teacher feedback hỗ trợ con.</p>
              <Link to="/learn" className="text-brand-green font-bold hover:text-brand-dark transition-colors text-sm flex items-center">
                Xem cách học Readizen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 font-bold text-2xl border border-green-100">🌱</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Tôi muốn bắt đầu luôn</h4>
              <p className="text-gray-500 text-sm mb-8 flex-grow">Xem bộ 5 truyện đầu tiên dành cho trẻ 5+ và sách Set 1 giúp con bắt đầu.</p>
              <Link to="/library" className="text-brand-green font-bold hover:text-brand-dark transition-colors text-sm flex items-center">
                Readizen Set 1 <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 12: CÂU HỎI THƯỜNG GẶP (FAQ) ================= */}
      <FAQSection
        badge="Hỏi ngắn"
        title="Câu hỏi thường gặp"
        items={faqHome}
      />

      {/* ================= SECTION 13: TRẢI NGHIỆM LUYỆN ĐỌC (CTA) ================= */}
      <CTABanner
        title="Bắt đầu với Readizen Set 1"
        subtitle="Readizen Set 1 bao gồm 5 cuốn sách luyện đọc dành cho bé 5+, được thiết kế dựa trên nền tảng kiến thức về 17 mục tiêu phát triển bền vững do UNESSCO ban hành."
        primaryText="Bắt đầu với Set 1"
        primaryHref="/library"
        secondaryText="Tìm hiểu cách học Readizen"
        secondaryHref="/learn"
      />

      <Footer />
    </div>
  );
}

export default App;
