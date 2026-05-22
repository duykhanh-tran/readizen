import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';  
import SafeImage from '../components/shared/SafeImage.jsx';
import FeatureCard from '../components/shared/FeatureCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import CTABanner from '../components/shared/CTABanner.jsx';

export default function Tech() {
  return (
    <div className="font-sans text-gray-800 bg-brand-cream min-h-screen selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-8 lg:py-14 min-h-[550px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/tech1.png"
            alt="Công nghệ Readizen"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-base font-bold mb-4 shadow-sm">
              <Check className="w-5 h-5" />
              Công nghệ phía sau luyện đọc
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
              Công nghệ Readizen giúp luyện đọc hấp dẫn và hiệu quả
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-800 mb-8 max-w-2xl leading-relaxed font-medium">
              Phía sau bộ truyện là hệ thống quản lý học tập, Speech AI, phản hồi từ giáo viên và gamification, giúp mỗi cuốn sách trở thành một hành trình đọc có mẫu, có luyện tập và có tiến trình rõ ràng tại nhà.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link 
                to="/learn" 
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Xem công nghệ cốt lõi
              </Link>
              <Link 
                to="/product" 
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Trải nghiệm với Set 1
              </Link>
            </div>

            <p className="text-base text-gray-700 max-w-lg font-medium">
              Công nghệ Readizen không thay thế sách hay phụ huynh. Công nghệ giúp việc đọc tại nhà dễ bắt đầu, dễ theo dõi và dễ duy trì hơn.
            </p>
          </div>
        </div>
      </header>

      {/* ================= SECTION 2: 4 CÔNG NGHỆ CỐT LÕI ================= */}
      <section className="bg-white py-24 relative z-20 rounded-t-[3rem] -mt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="4 lớp công nghệ cốt lõi"
            title="4 trụ cột giải pháp"
            subtitle="Mỗi lớp công nghệ có một vai trò rõ ràng: quản lý lộ trình, hỗ trợ luyện phát âm, kết nối giáo viên phản hồi và tạo động lực để trẻ quay lại đọc tiếp."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <FeatureCard
              emoji="🧭"
              title="Hệ thống Quản lý học tập"
              description="Lưu sách đã kích hoạt, tiến trình đọc, hoạt động đã hoàn thành và bài nói của con để phụ huynh dễ theo dõi."
              iconBg="bg-gray-50"
              iconBorder="border-gray-100"
            />
            
            <FeatureCard
              emoji="🎙️"
              title="Hệ thống Speech AI"
              description="Hỗ trợ con ghi âm, luyện đọc thành tiếng và nhận phản hồi ban đầu sau khi đọc."
              iconBg="bg-gray-50"
              iconBorder="border-gray-100"
            />
            
            <FeatureCard
              emoji="👨‍🏫"
              title="Hệ thống phản hồi Giáo viên"
              description="Luân chuyển bài nói lại câu chuyện và chuyển đến giáo viên để nhận xét, giúp ba mẹ biết con cần luyện thêm gì."
              iconBg="bg-gray-50"
              iconBorder="border-gray-100"
            />
            
            <FeatureCard
              emoji="🌱"
              title="Hệ thống Gamification"
              description="Ghi nhận nỗ lực bằng XP, Hạt Giống, cây xanh và Green Map để con thấy hành trình đọc của mình đang lớn lên."
              iconBg="bg-green-50"
              iconBorder="border-green-100"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: WORKFLOW ================= */}
      <section className="bg-brand-cream py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] p-4 sm:p-8 lg:p-16 relative">
            <SectionHeader
              badge="Chuỗi học tập với công nghệ Readizen"
              title="Workflow học tập tại Readizen"
              subtitle="Con vẫn bắt đầu từ sách giấy. Công nghệ chỉ xuất hiện đúng lúc để hỗ trợ những phần cần mẫu đọc, ghi âm, phản hồi và ghi nhận tiến trình."
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative text-left">
              <div className="hidden lg:block absolute top-12 left-10 right-10 h-[1px] border-b border-dashed border-gray-300 z-0"></div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm relative z-10 h-full hover:shadow-md transition-shadow">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 sm:mb-4">1</div>
                <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-xs sm:text-sm">Mở sách và nghe mẫu</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">Con nhìn tranh, đọc câu chuyện và dùng app để nghe mẫu những câu cần luyện.</p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm relative z-10 h-full hover:shadow-md transition-shadow">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 sm:mb-4">2</div>
                <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-xs sm:text-sm">Luyện đọc cùng AI</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">Con luyện đọc thành tiếng, ghi lại phần đọc và nghe lại chính mình. Hệ thống ghi nhận tiến trình.</p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm relative z-10 h-full hover:shadow-md transition-shadow">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 sm:mb-4">3</div>
                <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-xs sm:text-sm">Nộp bài Thuyết trình</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">Con tự chuẩn bị trình tự bài nói theo cách con muốn. Nói, quay và up video lên hệ thống.</p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm relative z-10 h-full hover:shadow-md transition-shadow">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs sm:text-sm mb-3 sm:mb-4">4</div>
                <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-xs sm:text-sm">Giáo viên phản hồi</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">Phản hồi video bài nói của con, giúp bố mẹ và con nhận ra những điểm được, chưa được.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: VAI TRÒ KHÁC NHAU ================= */}
      <section className="bg-gradient-to-b from-brand-dark to-brand-darker py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/10 text-brand-light text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-6">
            Ba lớp tạo niềm tin
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            AI, Giáo viên và Green Map có vai trò<br />khác nhau trong hành trình đọc
          </h2>
          <p className="text-brand-light opacity-80 max-w-2xl mx-auto mb-16 text-sm">
            Readizen không dùng công nghệ để thay thế con người. Mỗi lớp được thiết kế để hỗ trợ một phần cụ thể trong việc luyện đọc tại nhà.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3 text-brand-light">Speech AI giúp con luyện lại nhanh hơn</h3>
              <p className="text-sm text-gray-300 mb-6 min-h-[60px]">AI phản hồi ban đầu sau khi con đọc. Vai trò của AI là giúp con có tín hiệu để luyện lại, không phải tạo áp lực điểm số.</p>
              <div className="space-y-3">
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Ghi âm phần đọc</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Phản hồi nhanh</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Khuyến khích luyện lại</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3 text-brand-light">Giáo viên giúp ba mẹ hiểu con tiến bộ ra sao</h3>
              <p className="text-sm text-gray-300 mb-6 min-h-[60px]">Giáo viên phản hồi phần con nói lại câu chuyện, giúp phụ huynh biết con dùng từ, nói ý và cần luyện thêm điểm nào.</p>
              <div className="space-y-3">
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Nhận xét bài nói</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Gợi ý điểm cần luyện</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Không phải lớp học live</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3 text-brand-light">Green Map tạo động lực để theo đuổi việc đọc</h3>
              <p className="text-sm text-gray-300 mb-6 min-h-[60px]">Hoạt động hoàn thành được chuyển thành XP, Hạt Giống và cây xanh để con nhìn thấy hành trình học của mình lớn dần.</p>
              <div className="space-y-3">
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Ghi nhận nỗ lực</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Tạo mục tiêu tiếp theo</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-light border border-white/5">Không phải game gây nhiễu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: MINH BẠCH TIẾN TRÌNH ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="rounded-[2rem] p-8 lg:p-12 relative flex flex-col lg:flex-row gap-12 items-center">
            {/* Left text */}
            <div className="w-full lg:w-5/12 text-left">
              <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                Minh bạch tiến trình
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Những gì bố mẹ thấy
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                Readizen giúp ba mẹ không phải tự đoán. Các tín hiệu học tập được lưu lại để phụ huynh biết con đang ở đâu trong hành trình đọc và nên đồng hành tiếp như thế nào.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <span className="text-xl mb-2 block">📚</span>
                  <h4 className="font-bold text-brand-dark text-xs mb-1">Sách con đang đọc</h4>
                  <p className="text-[10px] text-gray-500">Theo dõi sách đang học, sách đã hoàn thành và bài học tiếp theo.</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <span className="text-xl mb-2 block">✅</span>
                  <h4 className="font-bold text-brand-dark text-xs mb-1">Hoạt động đã học</h4>
                  <p className="text-[10px] text-gray-500">Biết con đã nghe mẫu, luyện đọc, làm nhiệm vụ hay gửi bài nói chưa.</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <span className="text-xl mb-2 block">🎤</span>
                  <h4 className="font-bold text-brand-dark text-xs mb-1">Bài nói đã làm</h4>
                  <p className="text-[10px] text-gray-500">Xem lại phần Presentation để hiểu con đã nói lại câu chuyện ra sao.</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <span className="text-xl mb-2 block">👨‍🏫</span>
                  <h4 className="font-bold text-brand-dark text-xs mb-1">Nhận xét giáo viên</h4>
                  <p className="text-[10px] text-gray-500">Nắm được điểm con làm tốt và phần cần luyện thêm tại nhà.</p>
                </div>
              </div>
            </div>

            {/* Right Mockup */}
            <div className="w-full lg:w-7/12">
              <div className="bg-white border-4 border-brand-yellow rounded-3xl p-6 shadow-xl relative w-full transform lg:rotate-2 hover:rotate-0 transition duration-300">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm">👦</div>
                    <h3 className="font-bold text-gray-900 text-sm">Minh's Reading Journey</h3>
                  </div>
                  <span className="text-brand-green font-bold text-xs bg-brand-light px-2 py-1 rounded">Week 1</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                  <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-brand-green text-xs mb-1">Book in progress</h4>
                    <p className="text-xs text-gray-600">The Little Tree • 70% completed</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-brand-green text-xs mb-1">Reading practice</h4>
                    <p className="text-xs text-gray-600">3 recordings submitted</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-brand-green text-xs mb-1">Presentation</h4>
                    <p className="text-xs text-gray-600">1 video waiting for feedback</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-brand-green text-xs mb-1">Green Map</h4>
                    <p className="text-xs text-gray-600">2 Seeds • 1 Tree unlocked</p>
                  </div>
                </div>

                <div className="bg-brand-light border border-green-100 rounded-xl p-4 text-left">
                  <h4 className="font-bold text-brand-green text-xs mb-1">Teacher note</h4>
                  <p className="text-xs text-gray-700">Con nói rõ ý chính. Tuần này luyện thêm âm cuối trong "needs" và "seeds".</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: CÔNG NGHỆ HỖ TRỢ ================= */}
      <section className="bg-brand-cream py-20 font-sans">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Nguyên tắc công nghệ của Readizen"
            title="Công nghệ cộng sinh cùng sách"
            subtitle="Readizen dùng công nghệ cho những phần sách giấy khó tự làm: đọc mẫu, ghi âm, phản hồi, lưu tiến trình và tạo động lực. Trải nghiệm chính của con vẫn bắt đầu từ trang sách, tranh và câu chuyện."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="w-full flex justify-center">
              <div className="bg-white rounded-[2.5rem] p-3 sm:p-5 shadow-sm border border-gray-100 w-full relative">
                <SafeImage 
                  src="/assets/home3.png" 
                  alt="Trải nghiệm phương pháp Readizen" 
                  className="w-full h-auto object-cover rounded-[1.5rem]"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 sm:gap-5 text-left">
              <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">📚</span>
                </div>
                <div>
                  <h4 className="font-bold text-brand-green text-base sm:text-lg mb-1">App đi cùng sách</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Mỗi hoạt động trên app được thiết kế để quay lại với câu chuyện trong sách, không tách con khỏi việc đọc.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">⏱️</span>
                </div>
                <div>
                  <h4 className="font-bold text-brand-green text-base sm:text-lg mb-1">Dùng đúng lúc, đúng việc</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    App hỗ trợ các hoạt động ngắn như nghe mẫu, ghi âm và nhận phản hồi, phù hợp routine đọc 10-15 phút.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 sm:gap-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">🛡️</span>
                </div>
                <div>
                  <h4 className="font-bold text-brand-green text-base sm:text-lg mb-1">Tập trung, không gây nhiễu</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Giao diện hướng vào nhiệm vụ đọc, hạn chế yếu tố làm trẻ xao nhãng khỏi sách và câu chuyện.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 text-center">
            <Link to="/learn" className="inline-block bg-brand-yellow hover:bg-yellow-500 text-gray-900 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5">
              Xem thêm Phương pháp Readizen
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: TRẢI NGHIỆM READIZEN ================= */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Xem công nghệ trải nghiệm thật"
            title="Trải nghiệm Readizen"
            subtitle="Khi demo hoặc dùng thử, phụ huynh có thể quan sát trực tiếp cách sách, app, AI feedback, giáo viên và Green Map phối hợp với nhau."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="w-full aspect-[2/1] bg-brand-light rounded-xl mb-4 flex items-center justify-center text-3xl border border-dashed border-green-200">
                📖
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Màn hình My Bookshelf</h4>
              <p className="text-gray-500 text-xs mb-4 flex-grow">Con nhìn thấy sách đang đọc và những hoạt động cần hoàn thành.</p>
              <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Sách + LMS
              </span>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="w-full aspect-[2/1] bg-brand-light rounded-xl mb-4 flex items-center justify-center text-3xl border border-dashed border-green-200">
                🎙️
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Demo luyện đọc</h4>
              <p className="text-gray-500 text-xs mb-4 flex-grow">Con nghe mẫu, đọc lại, ghi âm và nhận phản hồi ban đầu.</p>
              <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Speech AI
              </span>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="w-full aspect-[2/1] bg-brand-light rounded-xl mb-4 flex items-center justify-center text-3xl border border-dashed border-green-200">
                📝
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Feedback giáo viên</h4>
              <p className="text-gray-500 text-xs mb-4 flex-grow">Phụ huynh thấy nhận xét cụ thể sau phần con nói lại câu chuyện.</p>
              <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Teacher Feedback
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: FINAL CTA ================= */}
      <CTABanner
        title="Readizen Set 1"
        subtitle="Readizen Set 1 giúp con bắt đầu với 5 truyện tiếng Anh, app luyện đọc, AI feedback, phản hồi từ giáo viên và Green Map tạo động lực đọc tiếp."
        primaryText="Bắt đầu với Set 1"
        primaryHref="/product"
        secondaryText="Xem cách học Readizen"
        secondaryHref="/learn"
      />

      <Footer />
    </div>
  );
}