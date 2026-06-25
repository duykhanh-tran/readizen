import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Smartphone,
  UserCheck,
  Check,
  Info,
  BookMarked,
  Compass,
  MessageSquare,
  MessagesSquare,
  Heart,
  Gift,
  MessageCircle,
  Sprout,
  User,
  Plus,
  X,
  ExternalLink,
  Star,
  Image as ImageIcon
} from 'lucide-react';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import FAQList from '../components/FAQList.jsx';

export default function Alphatest() {
  const [isFanned, setIsFanned] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  // Scroll animations observer
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { root: null, rootMargin: '0px', threshold: 0.15 }
      );

      const targets = document.querySelectorAll('.reveal-up, .reveal-soft');
      targets.forEach((el) => observer.observe(el));

      return () => {
        targets.forEach((el) => observer.unobserve(el));
      };
    }
  }, []);

  const handleCardClick = (index) => {
    setIsFanned(true);
    setActiveCard((prev) => (prev === index ? null : index));
  };

  const handleCardMouseEnter = () => {
    setIsFanned(true);
  };

  const handleCardMouseLeave = () => {
    setIsFanned(false);
    setActiveCard(null);
  };

  const faqs = [
    {
      question: "Con chưa đọc tiếng Anh tốt có dùng được không?",
      answer: "Được. Readizen thiết kế cho trẻ 5+ mới bắt đầu, câu ngắn, tranh rõ và có app nghe mẫu trước khi đọc sách."
    },
    {
      question: "Phụ huynh không giỏi tiếng Anh có hỗ trợ con được không?",
      answer: "Được. Ba mẹ chỉ cần đi theo hướng dẫn, cho con nghe app, đọc sách cùng con và quan sát trải nghiệm. Không cần tự dạy phát âm chuyên sâu."
    },
    {
      question: "Bản test có lỗi thì sao?",
      answer: "Đây là bản thử nghiệm, cho nên có thể có lỗi hoặc điểm chưa mượt. Phụ huynh chỉ cần ghi lại hoặc chụp/quay màn hình lỗi để Readizen sửa."
    },
    {
      question: "Test xong cần làm gì?",
      answer: "Ba mẹ điền form feedback và gửi bài Show & Tell nếu có. Readizen có thể liên hệ thêm để hỏi sâu 5–10 phút nếu ba mẹ đồng ý."
    }
  ];

  return (
    <div className="js-enabled min-h-screen bg-brand-cream text-gray-800 font-sans antialiased selection:bg-brand-yellow/30 overflow-x-hidden">
      {/* Inject custom styling in a self-contained style block */}
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        
        .bg-grid {
          background-image: radial-gradient(circle at 1px 1px, rgba(16,103,52,0.06) 1px, transparent 0);
          background-size: 32px 32px;
        }
        
        .section-kicker {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .5rem 1rem; border-radius: 9999px;
          background: #E6F0EB; color: #106734;
          font-size: .75rem; line-height: 1rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
        }
        
        .card-hover { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 25px 50px -12px rgba(16,103,52,0.1); border-color: rgba(16,103,52,.15); }

        .reveal-up, .reveal-soft { opacity: 1; transform: none; }
        
        .js-enabled .reveal-up {
          opacity: 0; transform: translateY(30px);
          transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .js-enabled .reveal-soft {
          opacity: 0;
          transition: opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .js-enabled .reveal-up.active, .js-enabled .reveal-soft.active { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }

        .hero-divider-bg { clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%); }

        .deck-stage {
          display: grid; grid-template-columns: 1fr; gap: 1.25rem;
          max-width: 360px; margin: 0 auto;
        }
        .deck-hint { display: none; }
        .deck-card {
          background: #fff; border-radius: 1.75rem; border: 1px solid #EAE5D1;
          padding: 2rem; box-shadow: 0 12px 30px -16px rgba(0,0,0,.25);
        }
        .deck-card:focus-visible { outline: 3px solid #FDBE15; outline-offset: 3px; }

        @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
          .deck-stage {
            display: block; position: relative; min-height: 480px;
            max-width: none; margin: 0;
          }
          .deck-hint {
            display: inline-flex; align-items: center; gap: .5rem;
            position: absolute; top: 22px; left: 50%; transform: translateX(-50%); z-index: 60;
            font-size: .72rem; letter-spacing: .12em; text-transform: uppercase;
            color: rgba(255,255,255,.55); font-weight: 600; white-space: nowrap;
          }
          .deck-card {
            position: absolute; left: 50%; top: 53%; width: 290px;
            cursor: pointer; transform-origin: 50% 100%; will-change: transform;
            transition: transform .6s cubic-bezier(.22,1,.36,1), box-shadow .4s, opacity .4s, filter .4s;
          }
          .deck-card[data-i="0"] { transform: translate(-50%,-50%) rotate(-7deg) translateX(-20px); z-index: 1; }
          .deck-card[data-i="1"] { transform: translate(-50%,-50%) translateY(-10px); z-index: 3; }
          .deck-card[data-i="2"] { transform: translate(-50%,-50%) rotate(7deg) translateX(20px); z-index: 2; }
          
          .deck-stage.fanned .deck-card[data-i="0"] { transform: translate(-50%,-50%) rotate(-11deg) translateX(-225px) translateY(6px); }
          .deck-stage.fanned .deck-card[data-i="1"] { transform: translate(-50%,-50%) translateY(-26px); }
          .deck-stage.fanned .deck-card[data-i="2"] { transform: translate(-50%,-50%) rotate(11deg) translateX(225px) translateY(6px); }
          
          .deck-card.active {
            transform: translate(-50%,-50%) translateY(-44px) scale(1.05) !important;
            z-index: 50 !important; box-shadow: 0 30px 60px -15px rgba(0,0,0,.45);
          }
          .deck-stage.has-active .deck-card:not(.active) { opacity: .4; filter: brightness(.85) saturate(.9); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
            transform: none !important;
          }
          .reveal-up, .reveal-soft { opacity: 1 !important; transform: none !important; }
        }
      ` }} />

      <Header />

      <main id="top">
        {/* ================= HERO ================= */}
        <section className="relative w-full py-16 lg:py-24 min-h-[680px] flex items-center overflow-hidden bg-brand-cream border-b border-[#EAE5D1] font-sans">
          <div className="absolute inset-0 bg-grid opacity-30 z-0"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl z-0"></div>
          
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10 w-full">
            {/* Left Column (Text & Stats) */}
            <div className="text-left relative z-20">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-sm font-bold mb-6 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow animate-pulse"></span>
                <span className="uppercase tracking-widest text-xs">Readizen Alpha Test — Lời mời tham gia trải nghiệm</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight reveal-up">
                Sách đọc tiếng Anh cho trẻ 5+ <br />
                <span className="text-brand-green">Luyện đọc tại nhà chỉ 15 phút mỗi ngày</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-800 mb-4 max-w-2xl leading-relaxed font-medium reveal-up delay-100">
                Readizen là giải pháp sách đọc tiếng Anh thế hệ mới kết hợp <strong className="text-brand-green font-semibold">Sách</strong>, <strong className="text-brand-green font-semibold">App</strong> và <strong className="text-brand-green font-semibold">Giáo viên thực</strong>, giúp nâng cao kỹ năng đọc, nói của con ngay tại nhà.
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed font-medium reveal-up delay-200">
                Hãy cùng con trải nghiệm bộ thử nghiệm Alpha Test đầu tiên của Readizen và cùng chúng tôi hoàn thiện sản phẩm.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 reveal-up delay-300">
                <Link
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  to="/register"
                >
                  Đăng ký trải nghiệm
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green font-bold text-lg text-center shadow-md hover:shadow-lg"
                  href="#flow"
                >
                  Quy trình luyện đọc
                </a>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-xl reveal-up delay-400">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-green/10 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-brand-green">5+</p>
                  <p className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">Tuổi</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-green/10 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-brand-green">3</p>
                  <p className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">Bước học</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-green/10 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-brand-green">15'</p>
                  <p className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">Mỗi buổi</p>
                </div>
              </div>
            </div>

            {/* Right Column (Visual placeholder) */}
            <div className="relative hidden lg:block h-full min-h-[480px]">
              <div className="absolute inset-0 bg-brand-green/5 rounded-[4rem] transform rotate-3 scale-105 blur-xl"></div>
              <div className="relative h-full bg-white rounded-[3rem] p-4 shadow-lift border border-[#EAE5D1] overflow-hidden flex flex-col justify-center reveal-soft delay-200">
                <div className="w-full aspect-[4/3] bg-brand-cream rounded-[2rem] overflow-hidden flex items-center justify-center relative border border-[#EAE5D1]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-light/30 to-brand-cream/30"></div>
                  <div className="text-center z-10 text-brand-green/60">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-60 text-brand-green" />
                    <p className="text-sm font-bold uppercase tracking-widest text-brand-green">Hình ảnh Mẹ và Bé đọc sách</p>
                  </div>
                </div>
                <div className="absolute -left-6 top-1/4 bg-white rounded-2xl p-4 shadow-2xl border border-[#EAE5D1] flex items-center gap-3 animate-bounce z-20" style={{ animationDuration: '4s' }}>
                  <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-green">
                    <Star className="w-5 h-5 fill-current text-brand-yellow" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">Đánh giá</p>
                    <p className="text-sm font-black text-gray-900">Tuyệt vời</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* ===== WHAT IS READIZEN ===== */}
        {/* ============================================================= */}
        <section className="py-20 lg:py-28 bg-white" id="what">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto reveal-up">
              <span className="section-kicker">Readizen là gì?</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Một cuốn sách đọc, ba trải nghiệm trong một</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                Readizen kết hợp <strong className="text-brand-green font-semibold">Sách giấy</strong>, <strong className="text-brand-green font-semibold">App học tập</strong> và <strong className="text-brand-green font-semibold">Giáo viên thực</strong> để phụ huynh và con luyện đọc tiếng Anh tại nhà.
              </p>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed font-medium">
                Ở giai đoạn thử nghiệm, nhóm phụ huynh tiên phong sẽ cùng con trải nghiệm bản dùng thử trong bối cảnh học thật và góp ý để Readizen hoàn thiện trước khi ra mắt.
              </p>
            </div>

            {/* Showcase panel: deck xòe bài */}
            <div className="relative mt-14 lg:mt-16 rounded-[3rem] bg-brand-dark overflow-hidden p-8 sm:p-12 lg:p-16 shadow-lift reveal-soft">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:28px_28px] opacity-60 pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

              <div
                className={`relative z-10 deck-stage ${isFanned ? 'fanned' : ''} ${activeCard !== null ? 'has-active' : ''}`}
                id="deck"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                <span className="deck-hint">
                  <Compass className="w-4 h-4" /> Rê chuột để xòe · Bấm để xem chi tiết
                </span>

                <article
                  className={`deck-card ${activeCard === 0 ? 'active' : ''}`}
                  data-i="0"
                  tabIndex="0"
                  role="button"
                  aria-label="Sách giấy: đọc và tương tác"
                  onClick={() => handleCardClick(0)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(0)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-brand-green mb-6">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Đọc &amp; tương tác</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-900">Sách giấy</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed font-medium">Truyện ngắn, câu đơn giản, tranh lớn và hoạt động tương tác: chọn tranh, hỏi đáp, cắt dán, Show &amp; Tell.</p>
                </article>

                <article
                  className={`deck-card ${activeCard === 1 ? 'active' : ''}`}
                  data-i="1"
                  tabIndex="0"
                  role="button"
                  aria-label="App học tập: nghe và luyện đọc"
                  onClick={() => handleCardClick(1)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(1)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Nghe &amp; luyện</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-900">App học tập</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed font-medium">Con nghe từ mới, mở rương từ vựng, xem Story Preview, luyện đọc và gửi bài nói sau khi học với sách.</p>
                </article>

                <article
                  className={`deck-card ${activeCard === 2 ? 'active' : ''}`}
                  data-i="2"
                  tabIndex="0"
                  role="button"
                  aria-label="Giáo viên thực: nhận phản hồi"
                  onClick={() => handleCardClick(2)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(2)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-6">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">Nhận phản hồi</p>
                  <h3 className="mt-2 text-2xl font-black text-gray-900">Giáo viên thực</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed font-medium">Bài Show &amp; Tell của con được gửi lại để nhận nhận xét, khích lệ và gợi ý cải thiện sau quá trình đọc.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FLOW ================= */}
        <section className="py-20 lg:py-28 bg-brand-cream" id="flow">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
              <span className="section-kicker">Con học như thế nào?</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Quy trình đọc 3 bước <br /><span className="text-brand-green">Before – Reading – After</span>
              </h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">Phụ huynh đồng hành đọc cùng con, hướng dẫn con học tập từng bước theo quy trình đọc 3 bước của Readizen.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <article className="bg-white rounded-[2.5rem] border border-[#EAE5D1] shadow-soft overflow-hidden card-hover flex flex-col reveal-up">
                <div className="p-8 pb-6 flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-2xl shadow-md">1</div>
                    <div>
                      <p className="text-xs font-bold text-brand-green uppercase tracking-widest">Before</p>
                      <p className="text-sm font-semibold text-gray-500">Học với app</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Làm quen nội dung</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed text-lg font-medium">Con nghe 5 từ mới, xem Story Preview và hoạt động đố vui trên App.</p>
                </div>
                <div className="p-4 pt-0">
                  <img alt="Before trên app" className="w-full aspect-[4/3] object-cover rounded-2xl animate-pulse-slow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY9atYSzbn3lF6s76n5Bl4MfxpSXwwHGgcqpawqRilo1V-4UTPG8qEa1vBeQ7IF_TIB7E7rsUiS-TUzwtJxsXauQ3o8nHgXmhGQBQr8WpiTRB2_Jhy1CDsPumUwNQlonHoG0_6oF8R-dgLMpXUKDw9CUTtzQ-aD38aINidQpIG9qBqOBhe6aPmILqWYb8Gts0G4jPDCZXkERMKNNikOeBe60xAODNf5oj8ekr2ldMHyhIdnnQ2nUsmTkBxO20KGCW6MgCiqB6e-Vo" />
                </div>
              </article>

              <article className="bg-white rounded-[2.5rem] border border-[#EAE5D1] shadow-soft overflow-hidden card-hover flex flex-col reveal-up delay-100">
                <div className="p-8 pb-6 flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-yellow text-brand-darker flex items-center justify-center font-black text-2xl shadow-md">2</div>
                    <div>
                      <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest">Reading</p>
                      <p className="text-sm font-semibold text-gray-500">Học với sách</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Đọc và tương tác</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed text-lg font-medium">Con đọc A Little Plant, làm Impact, Game hỏi đáp và Show &amp; Tell bằng storyboard cắt dán.</p>
                </div>
                <div className="p-4 pt-0">
                  <img alt="Hoạt động Show and Tell" className="w-full aspect-[4/3] object-cover rounded-2xl animate-pulse-slow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLby0v7CeAiJ6wnp5cQCRhnHgZ8JZyzYA5EzuRIAgTABpUO6UHPoQoh4QiLHXrqWoyRBco_SIxc0NbfFFpc2BMYUyYSoE6ZKJhCI5TG8GOMnjHOEHeHa9DoeVdj2A-gM5t2Df0zdFE_9sTTP3MwT59OSBru4KY_xn58Hl71Ojh2wMcNiI_449RnPGuXV5K3FiWRGSX2Kv-DvMWl_iD3qaO2i8Pzd0tp1pJclb2A41yNL4fxhNZ5SXXPu_NcXpxbd25pMHQThxlwpo" />
                </div>
              </article>

              <article className="bg-white rounded-[2.5rem] border border-[#EAE5D1] shadow-soft overflow-hidden card-hover flex flex-col reveal-up delay-200">
                <div className="p-8 pb-6 flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-2xl shadow-md">3</div>
                    <div>
                      <p className="text-xs font-bold text-brand-green uppercase tracking-widest">After</p>
                      <p className="text-sm font-semibold text-gray-500">Học với App</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Thực hành chấm điểm</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed text-lg font-medium">Con luyện đọc với AI, gửi bài Show &amp; Tell để nhận nhận xét từ giáo viên.</p>
                </div>
                <div className="p-4 pt-0">
                  <img alt="After trên app" className="w-full aspect-[4/3] object-cover rounded-2xl animate-pulse-slow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTJONcAfXz_2zU64X5Zu88W4LjukPeNyhkHi7czpUOjWqHtdueBePrfArCBbmsmbxEX8RgaAl3VsfdnEL3Zxd3CYoOy2GI59k9W6j5M-NNT7v2WeFUNmRgXDR0kvD5F0LILbxDNv8h9jI_-CUNASnPCZzaE4ASQkuHR1LcETvzM5xiELHYQLRlxc15w7y5iNGNczNkALKtPH1X8eUv3wFJGMynxdarI2o6DlbR3Zut1YkncwqeaTa9CUhwulKSGGiJJ2vMfc0CUpY" />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================= FIT ================= */}
        <section className="py-20 lg:py-28 bg-white relative" id="fit">
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="relative">
            <div className="text-center max-w-3xl mx-auto mb-16 px-5 reveal-up">
              <span className="section-kicker">Đối tượng</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Dành cho ai</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">Readizen cần phụ huynh mong muốn luyện đọc sách tiếng Anh cùng con tại nhà, ngay cả khi phụ huynh chưa tự tin về tiếng Anh của mình.</p>
            </div>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              <div className="bg-brand-green rounded-[2.5rem] p-10 lg:p-14 text-white shadow-lift relative overflow-hidden flex flex-col justify-center reveal-up">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">Phù hợp với</span>
                  <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">Hãy tham gia, nếu</h2>
                  <ul className="mt-10 space-y-6 text-brand-light font-medium text-lg">
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-brand-darker" />
                      </div>
                      <span>Con 5+, bắt đầu đọc tiếng Anh.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-brand-darker" />
                      </div>
                      <span>Phụ huynh muốn đọc cùng con tại nhà.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-brand-darker" />
                      </div>
                      <span>Phụ huynh muốn học mà chơi cùng con.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2.5rem] p-10 lg:p-14 border border-orange-100 shadow-soft relative overflow-hidden flex flex-col justify-center reveal-up delay-100">
                <div className="relative z-10">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-orange-100/50 text-orange-700 text-xs font-bold uppercase tracking-widest border border-orange-200/50">Chưa tối ưu nếu</span>
                  <h2 className="mt-6 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Chưa phù hợp, nếu...</h2>
                  <ul className="mt-10 space-y-6 text-gray-600 font-medium text-lg">
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-orange-500" />
                      </div>
                      <span>Con đã có thể đọc được truyện dài và nhiều chữ.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-orange-500" />
                      </div>
                      <span>Phụ huynh chưa sẵn sàng ngồi 15-30 phút đọc cùng con.</span>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-orange-500" />
                      </div>
                      <span>Phụ huynh muốn giải pháp rảnh tay, để con tự học.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= KIT ================= */}
        <section className="py-20 lg:py-28 bg-white" id="kit">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 reveal-up">
              <span className="section-kicker">Trong bộ test có gì?</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Test Kit</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">Bộ công cụ thử nghiệm được chuẩn bị để ba mẹ và con có thể thử trọn vẹn một vòng học: Before - Reading - After.</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-brand-green text-white font-bold shadow-md hover:bg-brand-dark transition-colors"
                  to="/register"
                >
                  Mở link dùng thử
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Link>
                <a className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-brand-light text-brand-green font-bold hover:bg-[#d8ebe1] transition-colors" href="#faq">
                  Xem câu hỏi thường gặp
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              <div className="bg-brand-cream rounded-[2rem] border border-[#EAE5D1] p-8 flex flex-col gap-6 items-start hover:shadow-md transition-shadow reveal-up delay-100">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand-green shadow-sm border border-[#EAE5D1]">
                  <BookMarked className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">Cuốn A Little Plant</p>
                  <p className="text-base text-gray-600 mt-2 font-medium">Cuốn đầu tiên của Readizen về chủ đề tự nhiên.</p>
                </div>
              </div>

              <div className="bg-brand-cream rounded-[2rem] border border-[#EAE5D1] p-8 flex flex-col gap-6 items-start hover:shadow-md transition-shadow reveal-up delay-200">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-[#EAE5D1]">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">App học tập</p>
                  <p className="text-base text-gray-600 mt-2 font-medium">Kết hợp cùng sách để tối ưu việc học tại nhà cho phụ huynh và con.</p>
                </div>
              </div>

              <div className="bg-brand-cream rounded-[2rem] border border-[#EAE5D1] p-8 flex flex-col gap-6 items-start hover:shadow-md transition-shadow reveal-up delay-300">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm border border-[#EAE5D1]">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">Tài liệu hướng dẫn</p>
                  <p className="text-base text-gray-600 mt-2 font-medium">Hướng dẫn đọc theo quy trình 3 bước: flow Before – Reading – After.</p>
                </div>
              </div>

              <div className="bg-brand-cream rounded-[2rem] border border-[#EAE5D1] p-8 flex flex-col gap-6 items-start hover:shadow-md transition-shadow reveal-up delay-400">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-[#EAE5D1]">
                  <MessagesSquare className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">Kênh Giáo viên</p>
                  <p className="text-base text-gray-600 mt-2 font-medium">Đồng hành cùng Phụ huynh trong quá trình trải nghiệm.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PARENTS ROLE ================= */}
        <section className="py-20 lg:py-28 bg-brand-green text-white relative overflow-hidden" id="parents">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] opacity-50"></div>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="reveal-up">
                <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">Vai trò của Phụ huynh</span>
                <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Người đồng hành cùng con</h2>
                <p className="mt-6 text-xl text-brand-light/90 leading-relaxed font-medium">Tại Readizen, phụ huynh đóng vai người đồng hành, động viên và đảm bảo con đọc đúng quy trình 3 bước. Về phần chuyên môn đã có App và đội ngũ Giáo viên thực hỗ trợ.</p>
              </div>
              <div className="bg-white text-gray-800 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative reveal-up delay-100">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center text-brand-darker shadow-lg hidden lg:flex">
                  <Heart className="w-6 h-6 fill-current text-brand-darker" />
                </div>
                <ul className="space-y-8">
                  <li className="flex gap-5 items-start">
                    <span className="w-10 h-10 shrink-0 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-black text-lg border border-brand-green/20">1</span>
                    <div>
                      <p className="text-lg font-bold text-gray-900 leading-snug">Ngồi cạnh con trong lần đầu dùng app và mở sách.</p>
                    </div>
                  </li>
                  <li className="flex gap-5 items-start">
                    <span className="w-10 h-10 shrink-0 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-black text-lg border border-brand-green/20">2</span>
                    <div>
                      <p className="text-lg font-bold text-gray-900 leading-snug">Đảm bảo con học theo quy trình: Before → Reading → After.</p>
                    </div>
                  </li>
                  <li className="flex gap-5 items-start">
                    <span className="w-10 h-10 shrink-0 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-black text-lg border border-brand-green/20">3</span>
                    <div>
                      <p className="text-lg font-bold text-gray-900 leading-snug">Ghi nhận phản ứng học tập của con.</p>
                    </div>
                  </li>
                  <li className="flex gap-5 items-start">
                    <span className="w-10 h-10 shrink-0 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-black text-lg border border-brand-green/20">4</span>
                    <div>
                      <p className="text-lg font-bold text-gray-900 leading-snug">Gửi feedback: điểm được, chưa được, cần cải thiện.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUYỀN LỢI ================= */}
        <section className="bg-[#FFFDF3] py-20 lg:py-28 relative" id="benefits">
          <div className="absolute inset-0 bg-grid opacity-50"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
              <span className="section-kicker">Lời cảm ơn</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Quà tặng tri ân</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                Cảm ơn ba mẹ đã dành thời gian cùng con trải nghiệm và góp ý cho Readizen. Đây là một số quyền lợi dành riêng cho nhóm phụ huynh tham gia trải nghiệm.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-white rounded-[2.5rem] p-10 border border-[#EAE5D1] shadow-sm hover:shadow-md transition-all duration-300 reveal-up">
                <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-green mb-8 shadow-sm border border-[#EAE5D1]">
                  <Gift className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center gap-2 bg-brand-light text-brand-green text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-brand-green/10 tracking-widest uppercase">
                  <span>Miễn phí</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Test Kit</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Ba mẹ được nhận bộ Readizen Test Kit để cùng con dùng thử, bao gồm Sách, App và các tài liệu hướng dẫn sử dụng.
                </p>
              </article>

              <article className="bg-white rounded-[2.5rem] p-10 border border-[#EAE5D1] shadow-sm hover:shadow-md transition-all duration-300 reveal-up delay-100">
                <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-green mb-8 border border-brand-green/10">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center gap-2 bg-brand-light text-brand-green text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                  <span>Phản hồi học tập</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Giáo viên thực</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Trong quá trình test, con có thể gửi bài đọc hoặc bài Show &amp; Tell để nhận nhận xét từ hệ thống và giáo viên thực.
                </p>
              </article>

              <article className="relative overflow-hidden bg-brand-green rounded-[2.5rem] p-10 text-white shadow-lift hover:shadow-xl transition-all duration-300 reveal-up delay-200">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-brand-yellow mb-8 border border-white/15 backdrop-blur-sm">
                    <Sprout className="w-8 h-8" />
                  </div>
                  <div className="inline-flex items-center gap-2 bg-brand-yellow text-brand-darker text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase shadow-sm">
                    <span>Ưu đãi Early Access</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">Ưu đãi 50% Readizen Set 1</h3>
                  <p className="text-brand-light/90 text-lg leading-relaxed font-medium">
                    Ba mẹ hoàn thành trải nghiệm và gửi feedback sẽ nhận ưu đãi{' '}
                    <span className="font-black text-brand-yellow">50%</span>{' '}
                    khi mua Readizen Set 1 – Bộ 5 sách thương mại đầu tiên.
                  </p>
                </div>
              </article>
            </div>
            
            <div className="mt-12 bg-white border border-[#EAE5D1] rounded-[2rem] p-8 flex flex-col sm:flex-row gap-6 items-start shadow-sm reveal-up delay-300">
              <div className="w-12 h-12 rounded-full bg-brand-light text-brand-green flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 mb-3">Lưu ý về ưu đãi</h4>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  Ưu đãi áp dụng cho phụ huynh tham gia trải nghiệm và hoàn thành feedback sau khi dùng thử.
                  Mỗi gia đình nhận 01 quyền ưu đãi, sử dụng khi Readizen Set 1 mở bán chính thức.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOUNDER ================= */}
        <section className="py-20 lg:py-28 bg-white" id="founder">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 reveal-up">
            <div className="bg-brand-cream rounded-[3rem] border border-[#EAE5D1] shadow-soft p-8 sm:p-12 lg:p-16 grid md:grid-cols-[auto,1fr] gap-10 items-center relative overflow-hidden">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative mx-auto md:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-light to-brand-cream"></div>
                <div className="text-center z-10 text-brand-green/40">
                  <User className="w-12 h-12 mx-auto mb-1 opacity-50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Chân dung<br />Founder</p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <span className="section-kicker">Người sáng lập</span>
                <h2 className="mt-6 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Teacher Mai Linh</h2>
                <p className="mt-6 text-gray-700 leading-relaxed text-lg font-medium">
                  Kỹ năng đọc đóng vai trò rất quan trọng trong việc thấu hiểu ngôn ngữ và nâng cao khả năng nói của trẻ. Readizen được phát triển từ mong muốn giúp mọi trẻ em có thể tự đọc tiếng Anh tại nhà.<br /><br />
                  Ở giai đoạn này, Cô Mai Linh rất mong nhận được những góp ý thật từ Phụ huynh để tối ưu, hoàn thiện Readizen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="py-20 lg:py-28 bg-[#FFFDF3]" id="faq">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-up">
              <span className="section-kicker">FAQ</span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Câu hỏi thường gặp</h2>
            </div>
            <FAQList items={faqs} />
          </div>
        </section>

        {/* ================= START ================= */}
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden" id="start">
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-brand-green/5 rounded-full blur-3xl"></div>
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 reveal-up">
            <div className="bg-brand-green rounded-[3rem] p-10 sm:p-14 lg:p-20 text-center text-white shadow-lift relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] opacity-50"></div>
              <div className="relative z-10">
                <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">Bắt đầu dùng thử</span>
                <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">Tham gia trải nghiệm</h2>
                <p className="mt-8 text-xl text-brand-light/90 max-w-2xl mx-auto leading-relaxed font-medium">
                  Hãy trở thành những phụ huynh tiên phong cùng Readizen thử nghiệm một cách học đọc tiếng Anh mới tại nhà.
                  Trải nghiệm thật và góp ý thật của ba mẹ sẽ giúp sản phẩm tốt hơn cho nhiều gia đình Việt.
                </p>
                <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Link
                    className="inline-flex items-center justify-center px-8 py-5 rounded-full bg-brand-yellow text-brand-darker font-bold hover:bg-yellow-400 transition-colors shadow-lg text-lg"
                    to="/register"
                  >
                    Đăng ký ngay
                  </Link>
                  <a className="inline-flex items-center justify-center px-8 py-5 rounded-full bg-white text-brand-green font-bold hover:bg-brand-light transition-colors shadow-md text-lg" href="#flow">
                    Xem hướng dẫn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#EAE5D1] px-5 py-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Link
          className="w-full inline-flex items-center justify-center py-3.5 rounded-full bg-brand-green text-white font-bold shadow-md hover:bg-brand-dark transition-colors text-lg"
          to="/register"
        >
          Bắt đầu dùng thử
        </Link>
      </div>
    </div>
  );
}
