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
  MessagesSquare,
  Heart,
  Gift,
  MessageCircle,
  Sprout,
  User,
  ExternalLink,
  Star,
  Image as ImageIcon,
  Menu,
  X
} from 'lucide-react';

// Custom header used directly for single-page smooth scrolling anchor layout
import Footer from '../components/Footer.jsx';
import FAQList from '../components/FAQList.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import './Alphatest.css';

// ============================================================================
// STATIC CONSTANTS (Declared outside of component to optimize performance)
// ============================================================================

const HERO_STATS = [
  { value: "5+", label: "Tuổi" },
  { value: "3", label: "Bước học" },
  { value: "15'", label: "Mỗi buổi" }
];

const DECK_CARDS = [
  {
    id: 0,
    kicker: "Đọc & tương tác",
    title: "Sách giấy",
    desc: "Truyện ngắn, câu đơn giản, tranh lớn và hoạt động tương tác: chọn tranh, hỏi đáp, cắt dán, Show & Tell.",
    icon: BookOpen,
    iconColorClass: "text-brand-green bg-green-50",
    kickerColorClass: "text-brand-green"
  },
  {
    id: 1,
    kicker: "Nghe & luyện",
    title: "App học tập",
    desc: "Con nghe từ mới, mở rương từ vựng, xem Story Preview, luyện đọc và gửi bài nói sau khi học với sách.",
    icon: Smartphone,
    iconColorClass: "text-blue-600 bg-blue-50",
    kickerColorClass: "text-blue-600"
  },
  {
    id: 2,
    kicker: "Nhận phản hồi",
    title: "Giáo viên thực",
    desc: "Bài Show & Tell của con được gửi lại để nhận nhận xét, khích lệ và gợi ý cải thiện sau quá trình đọc.",
    icon: UserCheck,
    iconColorClass: "text-yellow-600 bg-yellow-50",
    kickerColorClass: "text-yellow-600"
  }
];

const FLOW_STEPS = [
  {
    number: 1,
    phase: "Before",
    tool: "Học với app",
    title: "Làm quen nội dung",
    desc: "Con nghe 5 từ mới, xem Story Preview và hoạt động đố vui trên App.",
    imgSrc: "/assets/m4.jpg",
    imgAlt: "Before trên app",
    badgeColorClass: "bg-brand-green text-white",
    textColorClass: "text-brand-green",
    delayClass: ""
  },
  {
    number: 2,
    phase: "Reading",
    tool: "Học với sách",
    title: "Đọc và tương tác",
    desc: "Con đọc A Little Plant, làm Impact, Game hỏi đáp và Show & Tell bằng storyboard cắt dán.",
    imgSrc: "/assets/about1.webp",
    imgAlt: "Hoạt động Show and Tell",
    badgeColorClass: "bg-brand-yellow text-brand-darker",
    textColorClass: "text-brand-yellow",
    delayClass: "delay-100"
  },
  {
    number: 3,
    phase: "After",
    tool: "Học với App",
    title: "Thực hành chấm điểm",
    desc: "Con luyện đọc với AI, gửi bài Show & Tell để nhận nhận xét từ giáo viên.",
    imgSrc: "/assets/m1.jpg",
    imgAlt: "After trên app",
    badgeColorClass: "bg-brand-green text-white",
    textColorClass: "text-brand-green",
    delayClass: "delay-200"
  }
];

const FIT_CRITERIA = [
  {
    type: "suitable",
    badge: "Phù hợp với",
    title: "Hãy tham gia, nếu",
    items: [
      "Con 5+, bắt đầu đọc tiếng Anh.",
      "Phụ huynh muốn đọc cùng con tại nhà.",
      "Phụ huynh muốn học mà chơi cùng con."
    ],
    bgClass: "bg-brand-green text-white",
    badgeClass: "bg-white/15 text-white border-white/10",
    itemIconClass: "bg-brand-yellow text-brand-darker",
    delayClass: ""
  },
  {
    type: "unsuitable",
    badge: "Chưa tối ưu nếu",
    title: "Chưa phù hợp, nếu...",
    items: [
      "Con đã có thể đọc được truyện dài và nhiều chữ.",
      "Phụ huynh chưa sẵn sàng ngồi 15-30 phút đọc cùng con.",
      "Phụ huynh muốn giải pháp rảnh tay, để con tự học."
    ],
    bgClass: "bg-gray-50 border border-orange-100 text-gray-800",
    badgeClass: "bg-orange-100/50 text-orange-700 border-orange-200/50",
    itemIconClass: "bg-orange-100 text-orange-500",
    delayClass: "delay-100"
  }
];

const TEST_KIT_ITEMS = [
  {
    title: "Cuốn A Little Plant",
    desc: "Cuốn đầu tiên của Readizen về chủ đề tự nhiên.",
    icon: BookMarked,
    iconColorClass: "text-brand-green bg-white",
    delayClass: "delay-100"
  },
  {
    title: "App học tập",
    desc: "Kết hợp cùng sách để tối ưu việc học tại nhà cho phụ huynh và con.",
    icon: Smartphone,
    iconColorClass: "text-blue-600 bg-white",
    delayClass: "delay-200"
  },
  {
    title: "Tài liệu hướng dẫn",
    desc: "Hướng dẫn đọc theo quy trình 3 bước: flow Before – Reading – After.",
    icon: Compass,
    iconColorClass: "text-orange-500 bg-white",
    delayClass: "delay-300"
  },
  {
    title: "Kênh Giáo viên",
    desc: "Đồng hành cùng Phụ huynh trong quá trình trải nghiệm.",
    icon: MessagesSquare,
    iconColorClass: "text-purple-600 bg-white",
    delayClass: "delay-400"
  }
];

const PARENT_ROLES = [
  "Ngồi cạnh con trong lần đầu dùng app và mở sách.",
  "Đảm bảo con học theo quy trình: Before → Reading → After.",
  "Ghi nhận phản ứng học tập của con.",
  "Gửi feedback: điểm được, chưa được, cần cải thiện."
];

const BENEFITS = [
  {
    title: "Test Kit",
    desc: "Ba mẹ được nhận bộ Readizen Test Kit để cùng con dùng thử, bao gồm Sách, App và các tài liệu hướng dẫn sử dụng.",
    badge: "Miễn phí",
    badgeColorClass: "bg-brand-light text-brand-green border-brand-green/10",
    icon: Gift,
    iconColorClass: "text-brand-green bg-brand-cream border-[#EAE5D1]",
    bgClass: "bg-white border-[#EAE5D1] text-gray-600",
    delayClass: ""
  },
  {
    title: "Giáo viên thực",
    desc: "Trong quá trình test, con có thể gửi bài đọc hoặc bài Show & Tell để nhận nhận xét từ hệ thống và giáo viên thực.",
    badge: "Phản hồi học tập",
    badgeColorClass: "bg-brand-light text-brand-green border-brand-green/10",
    icon: MessageCircle,
    iconColorClass: "text-brand-green bg-brand-light border-brand-green/10",
    bgClass: "bg-white border-[#EAE5D1] text-gray-600",
    delayClass: "delay-100"
  },
  {
    title: "Ưu đãi 50% Readizen Set 1",
    desc: (
      <>
        Ba mẹ hoàn thành trải nghiệm và gửi feedback sẽ nhận ưu đãi{' '}
        <span className="font-black text-brand-yellow">50%</span>{' '}
        khi mua Readizen Set 1 – Bộ 5 sách thương mại đầu tiên.
      </>
    ),
    badge: "Ưu đãi Early Access",
    badgeColorClass: "bg-brand-yellow text-brand-darker border-transparent shadow-sm",
    icon: Sprout,
    iconColorClass: "text-brand-yellow bg-white/15 border-white/15 backdrop-blur-sm",
    bgClass: "relative overflow-hidden bg-brand-green text-white shadow-lift hover:shadow-xl",
    delayClass: "delay-200"
  }
];

const FAQS = [
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


function useScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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
  }, []);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Alphatest() {
  const [isFanned, setIsFanned] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const heroImages = [
    '/assets/m1.jpg',
    '/assets/about1.webp',
    '/assets/m4.jpg'
  ];
  const [currentHeroBgIndex, setCurrentHeroBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Trigger reveal scroll animations
  useScrollReveal();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('what');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['what', 'flow', 'test', 'start'];
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const NAV_ITEMS = [
    { label: 'Readizen là gì?', href: '#what' },
    { label: 'Cách học', href: '#flow' },
    { label: 'Bộ test', href: '#test' },
    { label: 'Bắt đầu', href: '#start' }
  ];

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

  return (
    <div className="min-h-screen bg-brand-cream text-gray-800 font-sans antialiased selection:bg-brand-yellow/30 overflow-x-hidden">
      {/* Custom Header for Alpha Test Smooth-Scroll Anchor Layout */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 py-3'
          : 'bg-transparent py-5'
        }`}>
        <div className="px-6 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center cursor-pointer flex-shrink-0">
            <img src="/assets/logo.png" alt="Readizen Logo" className="h-6 lg:h-8 w-auto object-contain" />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`font-bold text-sm transition-colors duration-200 relative py-2 ${isActive ? 'text-brand-green' : 'text-gray-700 hover:text-brand-green'
                    }`}
                >
                  {item.label}
                  {/* Underline indicator for active state */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-green transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}></span>
                </a>
              );
            })}
          </nav>

          {/* Right Action & Hamburger Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="hidden sm:inline-flex bg-brand-green hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors duration-200 shadow-sm"
            >
              Đăng ký ngay
            </Link>

            <button
              className="md:hidden p-2 text-brand-green hover:bg-brand-light/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg flex flex-col py-4 px-6 space-y-3 animate-in slide-in-from-top-2 duration-200 z-50">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block py-2.5 px-3 rounded-xl font-bold text-base transition-colors ${isActive ? 'bg-brand-light text-brand-green' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-brand-green hover:bg-brand-dark text-white text-center font-bold py-3 px-4 rounded-full text-sm transition-colors duration-200 shadow-md block"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ================= HERO ================= */}
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
                Lời mời tham dự
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                Thử nghiệm<br />
                giai đoạn <span className="font-bold text-[#00643D]"> Alpha Test</span> <br />
              </h1>

              <p className="text-xl lg:text-2xl text-slate-700 mb-4 max-w-2xl leading-relaxed font-medium">
                Readizen là sách đọc tiếng Anh thế hệ mới, kết hợp <span className="font-bold text-[#00643D]">Sách</span>, <span className="font-bold text-[#00643D]">App</span> và <span className="font-bold text-[#00643D]">Giáo viên thực</span>, tối ưu việc luyện đọc tại nhà cho phụ huynh và con.
              </p>

              <p className="text-xl lg:text-2xl text-slate-700 mb-4 max-w-2xl leading-relaxed font-medium">
                Cùng con trải nghiệm <span className="font-bold text-[#00643D]">sản phẩm đầu tiên</span> của Readizen và góp ý để <span className="font-bold text-[#00643D]">hoàn thiện</span> trước khi ra mắt.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/library"
                  className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Đăng kí trải nghiệm
                </Link>
                <Link
                  to="/practice"
                  className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
                >
                  Quy trình luyện đọc
                </Link>
              </div>

              {/* Info Cards */}
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <div className="w-32 bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex flex-col items-start transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="text-2xl font-bold text-[#00643D]">5+</span>
                  <span className="text-sm font-normal text-slate-700">Tuổi</span>
                </div>
                <div className="w-32 bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex flex-col items-start transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="text-2xl font-bold text-[#00643D]">3</span>
                  <span className="text-sm font-normal text-slate-700">Bước học</span>
                </div>
                <div className="w-32 bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex flex-col items-start transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="text-2xl font-bold text-[#00643D]">15'</span>
                  <span className="text-sm font-normal text-slate-700">Cuốn</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ================= INJECT CUSTOM ANIMATION ================= */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes float-in-air {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-16px); }
          }
          .animate-float {
            animation: float-in-air 6s ease-in-out infinite;
          }
        `}} />

        {/* ================= BACKGROUND GRADIENT XUYÊN SUỐT ================= */}
        <div className="relative bg-gradient-to-b from-brand-yellow/5 via-white to-brand-green/5 overflow-hidden">

          {/* Trang trí background lơ lửng (Decorative blobs) */}
          <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none"></div>

          {/* ================= NOTICE / INTRO ================= */}
          <section className="relative pt-12 pb-0 z-10">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
              <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-yellow/30 to-brand-yellow/10 flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  🧪
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-brand-green">
                      01. INTRODUCTION
                    </span>
                    <span className="w-8 h-[2px] bg-brand-green/30"></span>
                  </div>

                  <h2 className="mt-1 text-2xl font-black text-gray-900">
                    Thử nghiệm Alpha Test
                  </h2>

                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Readizen là giải pháp sách đọc thế hệ mới, giúp phụ huynh và con luyện đọc tại nhà.<br />
                    Ở giai đoạn Alpha Test, nhóm phụ huynh tiên phong sẽ cùng con trải nghiệm bản dùng thử trong bối cảnh học thật tại nhà.<br />
                    Mọi góp ý về Sách, App và quy trình học đều rất đáng quý và là cơ sở để Readizen hoàn thiện trước khi ra mắt chính thức.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= WHAT IS READIZEN ================= */}
          <section className="relative pt-8 pb-20 lg:pt-10 lg:pb-24 z-10" id="what">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                {/* Left Column: Text Content */}
                <div className="lg:col-span-5 reveal-up text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-brand-green">
                      02. WHAT IS READIZEN
                    </span>
                    <span className="w-8 h-[2px] bg-brand-green/30"></span>
                  </div>
                  <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
                    Readizen là sách đọc  3 trong 1
                  </h2>
                  <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                    Readizen kết hợp <strong className="text-brand-green font-semibold">Sách giấy</strong>, <strong className="text-brand-green font-semibold">App học tập</strong> và <strong className="text-brand-green font-semibold">Giáo viên </strong> đồng hành để phụ huynh và con trong quá trình luyện đọc tiếng Anh tại nhà.
                  </p>
                </div>

                {/* Right Column: Floating Deck (Không nền đằng sau, hiệu ứng lơ lửng) */}
                <div className="lg:col-span-7 relative w-full h-auto lg:h-[520px] py-10 lg:py-0 flex items-center justify-center reveal-soft">

                  {/* Wrapper tạo hiệu ứng lơ lửng toàn bộ bộ bài trên không trung */}
                  <div className="lg:animate-float w-full h-auto lg:h-full flex items-center justify-center relative">

                    {/* Shadow giả dưới mặt đất để tăng độ sâu của hiệu ứng lơ lửng */}
                    <div className="absolute -bottom-10 w-3/4 h-10 bg-black/5 rounded-[100%] blur-xl hidden lg:block"></div>

                    <div
                      className={`relative z-10 deck-stage ${isFanned ? 'fanned' : ''} ${activeCard !== null ? 'has-active' : ''}`}
                      id="deck"
                      onMouseEnter={handleCardMouseEnter}
                      onMouseLeave={handleCardMouseLeave}
                    >
                      {DECK_CARDS.map((card) => {
                        const IconComponent = card.icon;
                        const isActive = activeCard === card.id;
                        return (
                          <article
                            key={card.id}
                            className={`deck-card ${isActive ? 'active' : ''} shadow-xl border border-white/50`} // Thêm shadow nổi bật hơn cho từng thẻ
                            data-i={card.id}
                            tabIndex="0"
                            role="button"
                            aria-label={`${card.title}: ${card.kicker}`}
                            onClick={() => handleCardClick(card.id)}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(card.id)}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.iconColorClass}`}>
                              <IconComponent className="w-7 h-7" />
                            </div>
                            <p className={`text-xs font-bold uppercase tracking-widest ${card.kickerColorClass}`}>{card.kicker}</p>
                            <h3 className="mt-2 text-2xl font-black text-gray-900">{card.title}</h3>
                            <p className="mt-3 text-gray-600 leading-relaxed font-medium">{card.desc}</p>
                          </article>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>

        <section className="py-20 lg:py-28 bg-brand-cream" id="flow">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

            {/* ================= HEADER GIỮ NGUYÊN ================= */}
            <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10">
                Con học như thế nào?
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Quy trình đọc 3 bước <br /><span className="text-brand-green">Before – Reading – After</span>
              </h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                Phụ huynh đồng hành đọc cùng con, hướng dẫn con học tập từng bước theo quy trình đọc 3 bước của Readizen.
              </p>
            </div>

            {/* ================= THẺ BÀI MỚI ================= */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {FLOW_STEPS.map((step) => (
                <article
                  key={step.number}
                  tabIndex="0"
                  className={`group relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[2.5rem] shadow-soft overflow-hidden cursor-pointer outline-none reveal-up ${step.delayClass}`}
                >
                  {/* 1. Background Image (Nằm dưới cùng, tự động zoom nhẹ khi hover) */}
                  <img
                    alt={step.imgAlt}
                    src={step.imgSrc}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus:scale-110"
                  />

                  {/* 2. Gradient Overlay (Lớp phủ làm tối dần phần dưới ảnh để chữ trắng dễ đọc) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500"></div>

                  {/* 3. Badge Number (Góc trái trên cùng) */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-lg backdrop-blur-md border border-white/20 ${step.badgeColorClass}`}>
                      {step.number}
                    </div>
                  </div>

                  {/* 4. Nội dung (Nằm ở góc trái dưới cùng) */}
                  <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end">

                    {/* Wrapper di chuyển nhẹ lên trên khi hover */}
                    <div className="transform transition-transform duration-500 ease-out translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0">

                      {/* Phase & Tool */}
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-white mb-2 border border-white/30`}>
                          {step.phase}
                        </span>
                        <p className="text-sm font-medium text-gray-300">{step.tool}</p>
                      </div>

                      {/* Title chính (Luôn hiển thị) */}
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                        {step.title}
                      </h3>

                      {/* Mô tả chi tiết (Ẩn mặc định, Animation trượt mượt mà mở ra khi hover/chạm) */}
                      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <p className="mt-4 text-gray-200 leading-relaxed text-base sm:text-lg font-medium opacity-0 transition-opacity duration-500 delay-75 group-hover:opacity-100 group-focus:opacity-100">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* ================= FIT ================= */}
        <section className="py-20 lg:py-28 bg-white relative" id="fit">
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="relative">
            <div className="text-center max-w-3xl mx-auto mb-16 px-5 reveal-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10">
                Đối tượng
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Alpha Test dành cho ai</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">Readizen cần phụ huynh mong muốn luyện đọc sách tiếng Anh cùng con tại nhà, ngay cả khi phụ huynh chưa tự tin về tiếng Anh của mình.</p>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {FIT_CRITERIA.map((criteria, idx) => (
                <div key={idx} className={`rounded-[2.5rem] p-10 lg:p-14 shadow-lift relative overflow-hidden flex flex-col justify-center reveal-up ${criteria.delayClass} ${criteria.bgClass}`}>
                  {criteria.type === "suitable" && (
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                  )}
                  <div className="relative z-10">
                    <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-sm ${criteria.badgeClass}`}>
                      {criteria.badge}
                    </span>
                    <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">{criteria.title}</h2>
                    <ul className="mt-10 space-y-6 font-medium text-lg">
                      {criteria.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex gap-4 items-start">
                          <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${criteria.itemIconClass}`}>
                            {criteria.type === "suitable" ? (
                              <Check className="w-4 h-4 text-brand-darker" />
                            ) : (
                              <Info className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= KIT ================= */}
        <section className="py-20 lg:py-28 bg-white" id="test">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 reveal-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10">
                Trong bộ test có gì?
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Test Kit</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">Bộ công cụ Alpha test được chuẩn bị để ba mẹ và con có thể thử trọn vẹn một vòng học: Before - Reading - After.</p>
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
              {TEST_KIT_ITEMS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className={`bg-brand-cream rounded-[2rem] border border-[#EAE5D1] p-8 flex flex-col gap-6 items-start hover:shadow-md transition-shadow reveal-up ${item.delayClass}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-[#EAE5D1] ${item.iconColorClass}`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900">{item.title}</p>
                      <p className="text-base text-gray-600 mt-2 font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PARENTS ROLE ================= */}
        {/* ================= PARENTS ROLE ================= */}
        <section className="py-12 sm:py-20 lg:py-28 bg-brand-green text-white relative overflow-hidden" id="parents">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] opacity-50"></div>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Đổi lg:grid-cols-2 thành grid-cols-2 để ép 2 cột trên mọi màn hình */}
            <div className="grid grid-cols-2 gap-4 sm:gap-12 lg:gap-20 items-center">

              {/* Cột trái: Tiêu đề */}
              <div className="reveal-up text-left">
                <span className="inline-flex px-2 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                  Vai trò của Phụ huynh
                </span>
                <h2 className="mt-3 sm:mt-6 text-xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                  Người đồng hành cùng con
                </h2>
                <p className="mt-3 sm:mt-6 text-xs sm:text-xl text-brand-light/90 leading-relaxed font-medium">
                  Tại Readizen, phụ huynh đóng vai người đồng hành, động viên và đảm bảo con đọc đúng quy trình 3 bước. Về phần chuyên môn đã có App và đội ngũ Giáo viên thực hỗ trợ.
                </p>
              </div>

              {/* Cột phải: Danh sách */}
              <div className="bg-white text-gray-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-2xl relative reveal-up delay-100">

                {/* Icon Heart lề trái (chỉ hiện trên Desktop) */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-yellow rounded-full items-center justify-center text-brand-darker shadow-lg hidden lg:flex">
                  <Heart className="w-6 h-6 fill-current text-brand-darker" />
                </div>

                {/* Giảm khoảng cách giữa các dòng trên mobile */}
                <ul className="space-y-3 sm:space-y-5">
                  {PARENT_ROLES.map((role, idx) => (
                    <li key={idx} className="flex gap-2 sm:gap-5 items-start">

                      {/* Số thứ tự: Thu nhỏ đáng kể trên mobile để tiết kiệm diện tích */}
                      <span className="w-5 h-5 sm:w-10 sm:h-10 shrink-0 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-[10px] sm:text-lg shadow-md mt-0.5 sm:mt-0">
                        {idx + 1}
                      </span>

                      <div className="flex-1">
                        {/* Thu nhỏ font chữ text-sm trên mobile, sm:text-lg trên tablet/desktop */}
                        <p className="text-xs sm:text-lg font-bold text-gray-900 leading-snug">{role}</p>
                      </div>

                    </li>
                  ))}
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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10">
                Lời cảm ơn
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Quà tặng tri ân</h2>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                Cảm ơn ba mẹ đã dành thời gian cùng con trải nghiệm và góp ý cho Readizen. Đây là một số quyền lợi dành riêng cho nhóm phụ huynh tham gia Alpha Test.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BENEFITS.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <article key={idx} className={`rounded-[2.5rem] p-10 border transition-all duration-300 reveal-up ${benefit.delayClass} ${benefit.bgClass}`}>
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${benefit.iconColorClass}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border tracking-widest uppercase ${benefit.badgeColorClass}`}>
                        <span>{benefit.badge}</span>
                      </div>
                      <h3 className="text-2xl font-black mb-4">{benefit.title}</h3>
                      <p className="text-lg leading-relaxed font-medium">
                        {benefit.desc}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ================= CARD LƯU Ý (ĐÃ CHỈNH SỬA) ================= */}
            <div className="mt-12 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 sm:gap-5 items-start reveal-up delay-300">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">Lưu ý về ưu đãi</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  Ưu đãi áp dụng cho phụ huynh tham gia trải nghiệm và hoàn thành feedback sau khi dùng thử.
                  Mỗi gia đình nhận 01 quyền ưu đãi, sử dụng khi Readizen Set 1 mở bán chính thức.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================= FOUNDER ================= */}
        <section className="bg-white py-20 lg:py-28 relative z-20 font-sans" id="founder">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center reveal-up">

            {/* ================= CỘT TRÁI: ẢNH FOUNDER ================= */}
            <div className="w-full h-full min-h-[400px] lg:min-h-[500px]">
              <div className="relative w-full h-full min-h-[450px] bg-brand-cream rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
                <div className="absolute inset-0 w-full h-full">
                  <SafeImage
                    src="/assets/m3.jpg"
                    alt="Teacher Mai Linh - Founder Readizen"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: NỘI DUNG ================= */}
            <div className="flex flex-col justify-center text-left">

              {/* Badge / Kicker */}
              <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10 mb-6">
                Người sáng lập
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-8 tracking-tight">
                Teacher Mai Linh
              </h2>

              {/* Quote Block (Đã được thiết kế lại hoàn toàn) */}
              <div className="relative bg-brand-light/40 border border-brand-green/10 border-l-4 border-l-brand-green rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">

                {/* SVG Quote Icon */}
                <svg
                  className="w-10 h-10 text-brand-green/30 absolute top-6 left-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                {/* Nội dung Text */}
                <div className="relative z-10 pt-6 sm:pt-4">
                  <p className="font-medium text-gray-800 text-base sm:text-lg italic mb-6 leading-relaxed">
                    Kỹ năng đọc đóng vai trò rất quan trọng trong việc thấu hiểu ngôn ngữ và nâng cao khả năng nói của trẻ. Readizen được phát triển từ mong muốn giúp mọi trẻ em có thể tự đọc tiếng Anh tại nhà.
                    <br /><br />
                    Ở giai đoạn này, Cô Mai Linh rất mong nhận được những góp ý thật từ Phụ huynh để tối ưu, hoàn thiện Readizen trước khi ra mắt chính thức.
                  </p>


                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="py-20 lg:py-28 bg-[#FFFDF3]" id="faq">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-16 reveal-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-green text-xs font-bold tracking-widest uppercase border border-brand-green/10">
                FAQ
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Câu hỏi thường gặp</h2>
            </div>
            <FAQList items={FAQS} />
          </div>
        </section>

        {/* ================= CALL TO ACTION (Tràn viền) ================= */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[#0c4e2b] via-[#093f22] to-[#052614] text-white relative overflow-hidden" id="start">

          {/* Lớp nền SVG pattern tràn toàn bộ section */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPgo8L3N2Zz4=')] opacity-30"></div>

          {/* Điểm nhấn ánh sáng mờ lơ lửng phía sau */}
          <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-brand-green/20 rounded-full blur-[120px] pointer-events-none"></div>

          {/* Khối chứa nội dung được căn giữa */}
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 reveal-up text-center">

            <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">
              Bắt đầu dùng thử
            </span>

            <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              Tham gia trải nghiệm
            </h2>

            <p className="mt-8 text-xl text-brand-light/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Hãy trở thành những phụ huynh tiên phong cùng Readizen thử nghiệm một cách học đọc tiếng Anh mới tại nhà.
              Trải nghiệm thật và góp ý thật của ba mẹ sẽ giúp sản phẩm tốt hơn cho nhiều gia đình Việt.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Link
                className="inline-flex items-center justify-center px-8 py-5 rounded-full bg-brand-yellow text-brand-darker font-bold hover:bg-yellow-400 transition-colors shadow-lg text-lg"
                to="/register"
              >
                Đăng ký ngay
              </Link>
              <a
                className="inline-flex items-center justify-center px-8 py-5 rounded-full bg-white text-brand-green font-bold hover:bg-brand-light transition-colors shadow-md text-lg"
                href="#flow"
              >
                Xem hướng dẫn
              </a>
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
