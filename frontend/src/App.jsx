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
    '/assets/m4.jpg'
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
  const [activeProblem, setActiveProblem] = useState(0);

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
                width={1280}
                height={720}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
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
              Sách luyện đọc <br />
              tiếng Anh tại nhà
            </h1>

            <p className="text-xl lg:text-2xl text-gray-800 mb-4 max-w-2xl leading-relaxed font-medium">
              Readizen là sách luyện đọc tiếng Anh thế hệ mới.
              Giúp phụ huynh và con nâng cao kỹ năng đọc, nói tiếng Anh ngay tại nhà.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/library"
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Thư viện phiếu đọc AI
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
              src="/assets/home5_compressed.jpg"
              alt="Hộp sách Readizen"
              className="w-full h-full object-cover"
              width={400}
              height={400}
              loading="lazy"
            />
          </div>
          <div>
            <SectionHeader
              badge="Nền tảng học Tiếng Anh"
              title="Vì sao nên luyện đọc? "
              align="left"
              className="mb-6"
            />
            <p className="text-gray-600 mb-8 text-lg">
              Kỹ năng đọc là một trụ cột quan trọng trong việc học tiếng Anh. Giúp con thẩm thấu ngôn ngữ 1 cách tự nhiên và nâng cao khả năng nói cho trẻ.            </p>

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
                Với trẻ mới bắt đầu, vấn đề không phải là thiếu sách mà là con không chọn được sách phù hợp và các hướng dẫn cần thiết để đọc chủ động và hiệu quả.
              </p>

              <Link
                to="/practice"
                className="inline-flex items-center text-brand-green font-bold hover:text-brand-dark transition-colors"
              >
                Tìm hiểu truyện đọc có hướng dẫn
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              {[
                {
                  emoji: "📚",
                  title: "Sách vượt trình độ",
                  description:
                    "Nếu câu dài, từ khó hoặc tranh không rõ, con dễ nản ngay từ những trang đầu.",
                  iconBg: "bg-red-50",
                  iconBorder: "border-red-100",
                },
                {
                  emoji: "🎧",
                  title: "Không có hướng dẫn",
                  description:
                    "Con không biết âm thanh của câu nên dễ ngại đọc thành tiếng.",
                  iconBg: "bg-blue-50",
                  iconBorder: "border-blue-100",
                },
                {
                  emoji: "✨",
                  title: "Không có phản hồi",
                  description:
                    "Phụ huynh không chắc con đọc đúng chưa, cần sửa gì hoặc đã tiến bộ ở đâu.",
                  iconBg: "bg-yellow-50",
                  iconBorder: "border-yellow-100",
                },
              ].map((item, index) => null)}

              {/* Mobile / Tablet: hiển thị dạng card thường để dễ đọc */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:hidden">
                {[
                  {
                    emoji: "📚",
                    title: "Sách vượt trình độ",
                    description:
                      "Nếu câu dài, từ khó hoặc tranh không rõ, con dễ nản ngay từ những trang đầu.",
                    iconBg: "bg-red-50",
                    iconBorder: "border-red-100",
                  },
                  {
                    emoji: "🎧",
                    title: "Không có hướng dẫn",
                    description:
                      "Con không biết âm thanh của câu nên dễ ngại đọc thành tiếng.",
                    iconBg: "bg-blue-50",
                    iconBorder: "border-blue-100",
                  },
                  {
                    emoji: "✨",
                    title: "Không có phản hồi",
                    description:
                      "Phụ huynh không chắc con đọc đúng chưa, cần sửa gì hoặc đã tiến bộ ở đâu.",
                    iconBg: "bg-yellow-50",
                    iconBorder: "border-yellow-100",
                  },
                ].map((item, index) => (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setActiveProblem(index)}
                    className={`text-left rounded-[2rem] p-6 bg-white border shadow-sm transition-all duration-300 ${activeProblem === index
                      ? "border-brand-green shadow-xl -translate-y-1"
                      : "border-gray-100"
                      }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${item.iconBg} ${item.iconBorder} border flex items-center justify-center text-3xl mb-5`}
                    >
                      {item.emoji}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-6">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Desktop: card deck */}
              <div className="hidden lg:block">
                <div className="group relative min-h-[430px] flex items-center justify-center">
                  <div className="relative flex items-center justify-center w-full">
                    {[
                      {
                        emoji: "📚",
                        title: "Sách vượt trình độ",
                        description:
                          "Nếu câu dài, từ khó hoặc tranh không rõ, con dễ nản ngay từ những trang đầu.",
                        iconBg: "bg-red-50",
                        iconBorder: "border-red-100",
                        rotate: "-rotate-6",
                        z: "z-10",
                      },
                      {
                        emoji: "🎧",
                        title: "Không có hướng dẫn",
                        description:
                          "Con không biết âm thanh của câu nên dễ ngại đọc thành tiếng.",
                        iconBg: "bg-blue-50",
                        iconBorder: "border-blue-100",
                        rotate: "rotate-2",
                        z: "z-20",
                      },
                      {
                        emoji: "✨",
                        title: "Không có phản hồi",
                        description:
                          "Phụ huynh không chắc con đọc đúng chưa, cần sửa gì hoặc đã tiến bộ ở đâu.",
                        iconBg: "bg-yellow-50",
                        iconBorder: "border-yellow-100",
                        rotate: "rotate-6",
                        z: "z-30",
                      },
                    ].map((item, index) => (
                      <button
                        type="button"
                        key={item.title}
                        onClick={() => setActiveProblem(index)}
                        className={`
                    relative w-[220px] min-h-[310px] text-left rounded-[2rem] p-6 bg-white
                    border shadow-xl transition-all duration-500 ease-out
                    -ml-[150px] first:ml-0
                    group-hover:ml-4 group-hover:rotate-0
                    hover:-translate-y-6 hover:scale-105 hover:z-50
                    ${item.rotate}
                    ${activeProblem === index
                            ? "z-50 -translate-y-8 scale-105 border-brand-green"
                            : `${item.z} border-gray-100`
                          }
                  `}
                      >
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white via-white to-gray-50 pointer-events-none" />

                        <div className="relative z-10">
                          <div
                            className={`w-20 h-20 rounded-3xl ${item.iconBg} ${item.iconBorder} border flex items-center justify-center text-4xl mb-6 shadow-sm`}
                          >
                            {item.emoji}
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 text-sm leading-6">
                            {item.description}
                          </p>

                          <div className="mt-7 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${activeProblem === index
                                ? "w-full bg-brand-green"
                                : "w-1/2 bg-gray-200"
                                }`}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-green rounded-[2rem] p-10 lg:p-16 text-center text-white relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-4 left-4 text-9xl text-white/10 font-serif pointer-events-none select-none">
              “
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold mb-4 relative z-10">
              Con cần giải pháp mới để có thể tự đọc truyện tiếng Anh
            </h3>

            <p className="text-brand-light text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Với mỗi câu truyện, con cần được nghe mẫu, thực hành, nhận phản hồi cho bài đọc để việc đọc trở nên hào hứng và hiệu quả hơn.
            </p>

            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-3 border-2 border-white overflow-hidden shadow-md">
                <SafeImage
                  src="/assets/home6.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="font-bold text-lg text-white">Teacher Mai Linh</span>
              <p className="text-brand-light text-sm opacity-80">
                Readizen's Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: SO SÁNH SÁCH THƯỜNG VS SÁCH READIZEN ================= */}
      {/* <section className="bg-brand-cream py-16 lg:py-24 relative overflow-hidden font-sans">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center relative z-10">

          <SectionHeader
            badge="Sách đọc tiếng Anh"
            title="Sách thường vs Sách Readizen"
            subtitle="Sách thường để phụ huynh và con tự đọc. Sách Readizen cung cấp giải pháp từng bước giúp mọi phụ huynh và con có thể tự luyện đọc tiếng Anh tại nhà thành công."
          />

          <div className="relative mt-12 mb-10 flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center font-black text-gray-300 border border-gray-100">
              VS
            </div>
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

            <div className="w-full md:w-1/2 bg-white rounded-3xl p-6 lg:p-10 shadow-xl border-2 border-brand-green relative z-10 transform md:scale-105 hover:-translate-y-1 transition-all duration-500">
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
      </section> */}

      {/* ================= SECTION 5 & 6: QUY TRÌNH LUYỆN ĐỌC KHOA HỌC ================= */}
      <section className="bg-brand-cream py-20 lg:py-32 overflow-hidden relative font-sans">
        {/* Background Decorators */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[12%] -left-[10%] w-[42%] h-[42%] rounded-full bg-brand-green/5 blur-[120px]" />
          <div className="absolute top-[50%] -right-[12%] w-[35%] h-[55%] rounded-full bg-brand-yellow/5 blur-[120px]" />
          <div className="absolute bottom-[8%] left-[30%] w-[28%] h-[28%] rounded-full bg-white/60 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <SectionHeader
            badge="Thành phần Readizen"
            title="Readizen, sách đọc 3 trong 1"
            subtitle="Với Readizen, con dùng Sách để đọc, App để xem hướng dẫn và thực hành đọc, Giáo viên phản hồi kết quả đọc."
          />

          <div className="relative mt-12 sm:mt-20">
            {/* Desktop flow line */}
            <div className="hidden md:block absolute top-[4.25rem] left-[17%] right-[17%] z-0">
              <div className="h-2 rounded-full bg-white shadow-inner border border-brand-green/10" />
              <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-brand-green/10 via-brand-green/30 to-brand-yellow/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 text-left relative z-10">
              {/* ================= THẺ BƯỚC 1 ================= */}
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
                className={`group relative text-left rounded-[2rem] transition-all duration-500 outline-none ${activeStep === 1
                    ? "md:-translate-y-4"
                    : "hover:md:-translate-y-3"
                  }`}
              >
                {/* Step number */}
                <div className="relative z-20 flex justify-center mb-5">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white shadow-xl transition-all duration-500 ${activeStep === 1
                        ? "bg-brand-dark text-white rotate-3 scale-110"
                        : "bg-brand-green text-white group-hover:bg-brand-dark group-hover:scale-110"
                      }`}
                  >
                    <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">1</span>
                  </div>
                </div>

                <div
                  className={`relative bg-white rounded-[2rem] overflow-hidden shadow-lg border transition-all duration-500 ${activeStep === 1
                      ? "border-brand-green shadow-2xl"
                      : "border-white/80 group-hover:shadow-2xl group-hover:border-brand-green/30"
                    }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src="/assets/m1.jpg"
                      alt="Học với App"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-brand-dark/45 to-transparent" />

                    <div className="absolute left-5 right-5 bottom-5">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-sm font-bold shadow-lg">
                        <span className="text-lg">📖</span> Sách giấy
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 lg:p-7">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
                      Truyện ngắn, câu văn súc tích, tranh vẽ nhân vật vui vẻ tạo cảm hứng học tập cho con.
                    </p>

                    <div className="mt-6 h-2 rounded-full bg-brand-cream overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-brand-green transition-all duration-500 ${activeStep === 1
                            ? "w-full"
                            : "w-1/3 group-hover:w-full"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* ================= THẺ BƯỚC 2 ================= */}
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
                className={`group relative text-left rounded-[2rem] transition-all duration-500 outline-none ${activeStep === 2
                    ? "md:-translate-y-4"
                    : "hover:md:-translate-y-3"
                  }`}
              >
                {/* Step number */}
                <div className="relative z-20 flex justify-center mb-5">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white shadow-xl transition-all duration-500 ${activeStep === 2
                        ? "bg-brand-dark text-white rotate-3 scale-110"
                        : "bg-brand-green text-white group-hover:bg-brand-dark group-hover:scale-110"
                      }`}
                  >
                    <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">2</span>
                  </div>
                </div>

                <div
                  className={`relative bg-white rounded-[2rem] overflow-hidden shadow-lg border transition-all duration-500 ${activeStep === 2
                      ? "border-brand-green shadow-2xl"
                      : "border-white/80 group-hover:shadow-2xl group-hover:border-brand-green/30"
                    }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src="/assets/home1.jpg"
                      alt="Học với Sách"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-brand-dark/45 to-transparent" />

                    <div className="absolute left-5 right-5 bottom-5">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-sm font-bold shadow-lg">
                        <span className="text-lg">📱</span> App học tập
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 lg:p-7">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
                      App hướng dẫn con nghe mẫu, luyện đọc nhận phản hồi thay vì tự đoán cách đọc.
                    </p>

                    <div className="mt-6 h-2 rounded-full bg-brand-cream overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-brand-green transition-all duration-500 ${activeStep === 2
                            ? "w-full"
                            : "w-2/3 group-hover:w-full"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* ================= THẺ BƯỚC 3 ================= */}
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 3 ? null : 3)}
                className={`group relative text-left rounded-[2rem] transition-all duration-500 outline-none ${activeStep === 3
                    ? "md:-translate-y-4"
                    : "hover:md:-translate-y-3"
                  }`}
              >
                {/* Step number */}
                <div className="relative z-20 flex justify-center mb-5">
                  <div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-4 border-white shadow-xl transition-all duration-500 ${activeStep === 3
                        ? "bg-brand-dark text-white rotate-3 scale-110"
                        : "bg-brand-green text-white group-hover:bg-brand-dark group-hover:scale-110"
                      }`}
                  >
                    <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">3</span>
                  </div>
                </div>

                <div
                  className={`relative bg-white rounded-[2rem] overflow-hidden shadow-lg border transition-all duration-500 ${activeStep === 3
                      ? "border-brand-green shadow-2xl"
                      : "border-white/80 group-hover:shadow-2xl group-hover:border-brand-green/30"
                    }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src="/assets/home2.jpg"
                      alt="Đánh giá từ Giáo viên"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-brand-dark/45 to-transparent" />

                    <div className="absolute left-5 right-5 bottom-5">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-green/30 backdrop-blur-md border border-brand-green/40 text-brand-cream text-sm font-bold shadow-lg">
                        <span className="text-lg">👩‍🏫</span> Giáo viên thực
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 lg:p-7">
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
                      Giáo viên đánh giá bài đọc của con, nhận xét điểm mạnh, điểm cần cải thiện qua mỗi bài đọc.
                    </p>

                    <div className="mt-6 h-2 rounded-full bg-brand-cream overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-brand-green transition-all duration-500 ${activeStep === 3
                            ? "w-full"
                            : "w-full"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6.5: QUY TRÌNH ĐỌC 3 BƯỚC ================= */}
      <section className="bg-white py-16 lg:py-24 relative overflow-hidden font-sans">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-brand-light/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <SectionHeader
            badge="Học tập"
            title="Quy trình đọc 3 bước"
            subtitle="Quy trình được thiết kế dành riêng cho phụ huynh và con tự đọc, học tại nhà. Đặc biệt là những phụ huynh chưa tự tin về trình độ tiếng Anh của bản thân."
          />

          <div className="relative mt-16">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-[64px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-brand-green/20 via-brand-yellow/30 to-brand-green/20 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left relative z-10">
              {/* Step 1 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 border border-gray-100/80 hover:border-brand-green/20 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Large Background number watermark */}
                <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  01
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mb-6 shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-brand-dark transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a7 7 0 0 1 14 0h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-5a9 9 0 0 0-9-9z"></path>
                    </svg>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-xl mb-1">Before</h4>
                  <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-brand-light text-brand-green mb-4">
                    Học với App
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Con làm quen từ mới, âm thanh và cách đọc của cuốn sách thông qua App.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 border border-gray-100/80 hover:border-brand-green/20 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Large Background number watermark */}
                <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  02
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mb-6 shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-brand-dark transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H11a2 2 0 0 1 2 2v16.25A4.98 4.98 0 0 0 9.5 19H6.5A2.5 2.5 0 0 1 4 16.5v-12z"></path>
                      <path d="M20 4.5A2.5 2.5 0 0 0 17.5 2H13a2 2 0 0 0-2 2v16.25A4.98 4.98 0 0 1 14.5 19h3A2.5 2.5 0 0 0 20 16.5v-12z"></path>
                    </svg>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-xl mb-1">Reading</h4>
                  <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-brand-light text-brand-green mb-4">
                    Học với Sách
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Trải nghiệm đọc hoàn toàn với Sách giấy, đi kèm with hướng dẫn đọc từng câu từ App.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 border border-gray-100/80 hover:border-brand-green/20 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden sm:col-span-2 lg:col-span-1">
                {/* Large Background number watermark */}
                <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  03
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mb-6 shadow-md border-4 border-white group-hover:scale-110 group-hover:bg-brand-dark transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4z"></path>
                      <path d="M19 10a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-3.07A7 7 0 0 0 19 10z"></path>
                    </svg>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-xl mb-1">After</h4>
                  <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-brand-light text-brand-green mb-4">
                    Học với App
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Thực hành bài nói và nhận đánh giá từ hệ thống AI và Giáo viên thực.
                  </p>
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
