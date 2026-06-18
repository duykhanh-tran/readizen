import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import FeatureCard from '../components/shared/FeatureCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import CTABanner from '../components/shared/CTABanner.jsx';
import FAQSection from '../components/shared/FAQSection.jsx';
import { faqAbout } from '../data/faqData.js';

export default function About() {
  return (
    <div className="font-sans text-gray-800 bg-brand-cream min-h-screen selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-16 lg:py-20 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/about2.webp"
            alt="Về Readizen"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-base font-bold mb-4 shadow-sm">
              <Check className="w-5 h-5" />
              Về Readizen
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
              Nâng cao năng lực đọc sách tiếng Anh cho trẻ em Việt Nam ngay tại nhà
            </h1>

            <p className="text-xl lg:text-2xl text-gray-800 mb-8 max-w-2xl leading-relaxed font-medium">
              Kỹ năng đọc là nền tảng quan trọng để trẻ hiểu ngôn ngữ, tích lũy cách diễn đạt và tự tin nói tiếng Anh.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/learn"
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Tìm hiểu cách học Readizen
              </Link>
              <Link
                to="/library"
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Xem Readizen Set 1
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SECTION 2: FOUNDER STORY ================= */}
      <section className="bg-white py-24 relative z-20 font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Image */}
          <div className="w-full h-full min-h-[400px] lg:min-h-full">
            <div className="relative w-full h-full min-h-[450px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group">
              <div className="absolute inset-0 w-full h-full">
                <SafeImage
                  src="/assets/m3.jpg"
                  alt="Founder Story"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Text */}
          <div className="flex flex-col justify-center text-left">
            <div className="inline-block self-start bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Câu chuyện nhà sáng lập
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Làm sao để trẻ đọc được các câu truyện tiếng Anh?
            </h2>

            <div className="text-gray-600 space-y-4 text-[15px] leading-relaxed mb-8">
              <p>
                Nhiều trẻ học tiếng Anh từ sớm, biết từ vựng, biết hát, biết trả lời vài mẫu câu. Nhưng khi cầm một cuốn truyện tiếng Anh, các em vẫn lúng túng: không biết bắt đầu từ đâu, đọc câu thế nào, và đọc xong thì làm gì tiếp.              </p>
              <p>
                Readizen được xây dựng từ niềm tin rằng trẻ không cần thêm áp lực. Trẻ cần những câu chuyện phù hợp, có tranh để hiểu, có âm mẫu để nghe, có cơ hội đọc lại, và có Giáo viên phản hồi bài đọc của trẻ.
              </p>
              <p>
                Readizen bắt đầu từ sách giấy, rồi dùng công nghệ và giáo viên hỗ trợ từ xa để giúp trẻ tự mình đọc được các cuốn sách tiếng Anh.
              </p>
            </div>

            {/* Quote Block */}
            <div className="border-l-4 border-brand-green bg-brand-light rounded-r-2xl p-6 relative mt-auto">
              <svg
                className="w-8 h-8 text-brand-green opacity-20 absolute top-4 left-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-bold text-brand-darker text-[15px] relative z-10 italic mb-3 leading-relaxed pl-2">
                "Tôi không muốn trẻ chỉ đơn giản có thêm một cuốn sách tiếng Anh trên kệ. Tôi muốn mỗi cuốn sách trở thành một trải nghiệm đọc mà con có thể đọc, hiểu và nói lại theo cách của mình."
              </p>
              <span className="text-sm text-brand-green font-semibold pl-2">- Mai Linh | Founder</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: VẤN ĐỀ NHẬN RA ================= */}
      <section className="bg-brand-cream py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Vấn đề luyện đọc"
            title="Đọc sách quan trọng hơn những gì bạn nghĩ"
            subtitle="Khi tiếng Anh chỉ nằm trong từ vựng, bài tập hoặc mẫu câu rời rạc, trẻ dễ nhớ rồi quên, biết từ nhưng khó dùng. Những câu chuyện vừa sức giúp con gặp ngôn ngữ trong bối cảnh, hiểu điều đang xảy ra và có nội dung để nói lại."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute -bottom-4 -right-2 text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-xl">🧩</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm ">Thẩm thấu ngôn ngữ tự nhiên</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Câu chuyện giúp con hiểu điều đang xảy ra, không chỉ dịch từng từ riêng lẻ</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute -bottom-4 -right-2 text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">03</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-xl">🔄</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm ">Câu truyện giúp ghi nhớ</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Từ và mẫu câu được lặp lại trong một ngữ cảnh, giúp con ghi nhớ tự nhiên hơn.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute -bottom-4 -right-2 text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">04</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">💬</div>
                <h4 className="font-bold text-green-900 mb-2 text-sm ">Đọc tăng cường kỹ năng nói</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Khi hiểu câu chuyện, con có thể kể lại, trả lời và trình bày bằng tiếng Anh đơn giản.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: QUAN ĐIỂM GIÁO DỤC ================= */}
      <section className="bg-white py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Quan điểm giáo dục"
            title="Đọc được trước khi đọc giỏi"
            subtitle="Ở giai đoạn đầu, điều quan trọng nhất không phải là con đọc thật nhiều hay đọc thật khó. Con cần những thành công nhỏ: đọc được một câu, hiểu được một tranh, trả lời được một câu hỏi và nói lại được một ý."
          />

          {/* SỬA CHÍNH Ở ĐÂY: Dùng grid-cols-3 cho tất cả màn hình, điều chỉnh gap nhỏ trên mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 text-left">

            {/* Card 01 */}
            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              {/* Chữ số nền: thu nhỏ trên mobile, phóng to trên web */}
              <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[40px] sm:text-[70px] lg:text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">01</div>
              <div className="relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-sm sm:text-xl text-brand-green">📖</div>
                <h4 className="font-bold text-green-900 mb-1 sm:mb-2 text-[10px] sm:text-sm leading-tight">Bắt đầu từ đơn giản</h4>
                <p className="text-gray-500 text-[9px] sm:text-xs leading-tight sm:leading-relaxed hidden sm:block">Trẻ dễ bước vào reading hơn khi câu chuyện ngắn, tranh rõ và ngôn ngữ nằm trong tình huống con có thể hiểu.</p>
                <p className="text-gray-500 text-[9px] leading-tight sm:hidden line-clamp-3">Truyện ngắn, tranh rõ, tình huống dễ hiểu.</p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[40px] sm:text-[70px] lg:text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">02</div>
              <div className="relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-sm sm:text-xl text-yellow-500">✨</div>
                <h4 className="font-bold text-green-900 mb-1 sm:mb-2 text-[10px] sm:text-sm leading-tight">Từng bước thành công</h4>
                <p className="text-gray-500 text-[9px] sm:text-xs leading-tight sm:leading-relaxed hidden sm:block">Khi con đọc được một câu, hoặc trả lời được một câu hỏi, con bắt đầu tin rằng mình có thể đọc tiếp.</p>
                <p className="text-gray-500 text-[9px] leading-tight sm:hidden line-clamp-3">Đọc 1 câu, trả lời 1 ý giúp con tự tin hơn.</p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-white p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[40px] sm:text-[70px] lg:text-[100px] font-black text-gray-50 opacity-60 z-0 leading-none group-hover:scale-110 transition-transform">03</div>
              <div className="relative z-10">
                <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 text-sm sm:text-xl text-blue-500">💬</div>
                <h4 className="font-bold text-green-900 mb-1 sm:mb-2 text-[10px] sm:text-sm leading-tight">Đọc hiểu trước, đọc giỏi sau</h4>
                <p className="text-gray-500 text-[9px] sm:text-xs leading-tight sm:leading-relaxed hidden sm:block">Ở giai đoạn đầu, điều cần thiết là giúp con hiểu điều đang xảy ra trong câu chuyện.</p>
                <p className="text-gray-500 text-[9px] leading-tight sm:hidden line-clamp-3">Ưu tiên hiểu chuyện gì đang xảy ra trước.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 5: HỆ THỐNG READIZEN (Dark Section) ================= */}
      <section className="bg-gradient-to-b from-brand-dark to-brand-darker py-24 relative overflow-hidden text-left">
        <div className="absolute bottom-0 left-0 text-[180px] lg:text-[280px] font-black text-white/5 leading-none tracking-tighter select-none z-0">
          READ
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <div className="inline-block bg-white/10 text-brand-light text-xs font-bold px-3 py-1 rounded-md mb-4 border border-white/10">
              Readizen là gì?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Readizen là hệ thống sách luyện đọc tiếng Anh tại nhà
            </h2>
            <p className="text-brand-light text-sm opacity-90 leading-relaxed max-w-md">
              Readizen kết hợp Sách giấy, App luyện đọc và Giáo viên thực từ xa để giúp trẻ bắt đầu reading tại nhà theo một quy trình rõ ràng: xem tranh, nghe mẫu, đọc lại, hiểu câu chuyện và nói lại điều đã đọc.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg transform translate-x-0 hover:-translate-x-2 transition-transform">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📚</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Sách giấy</h4>
                <p className="text-xs text-gray-500">Truyện ngắn, tranh rõ, đúng trình độ, nội dung gần gũi.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg transform translate-x-0 lg:-translate-x-4 hover:-translate-x-6 transition-transform">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📱</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">App luyện đọc</h4>
                <p className="text-xs text-gray-500">Nghe âm mẫu, luyện đọc AI, làm nhiệm vụ và theo dõi tiến trình.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg transform translate-x-0 lg:-translate-x-8 hover:-translate-x-10 transition-transform">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✨</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Giáo viên phản hồi</h4>
                <p className="text-xs text-gray-500">Giáo viên hỗ trợ nhận xét bài nói cuối câu chuyện của con.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION BRAND IMAGE BANNER ================= */}
      <section className="relative w-full">
        <div
          className="relative bg-cover bg-center py-24 lg:py-32"
          style={{ backgroundImage: "url('/assets/about1.webp')" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center text-white flex flex-col items-center">
            <div className="inline-block bg-white text-brand-green text-sm font-bold px-6 py-2.5 rounded-full mb-6 shadow-lg">
              Ý nghĩa thương hiệu
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
              Small Readers, Big Citizens
            </h2>

            <p className="text-base md:text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Readizen không chỉ muốn trẻ đọc tiếng Anh tốt hơn. Chúng tôi muốn mỗi câu chuyện giúp trẻ mở rộng cách nhìn về bản thân, người khác và thế giới xung quanh.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: SỨ MỆNH & TẦM NHÌN ================= */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Sứ mệnh & tầm nhìn"
            title="Hình thành văn hóa Reading tiếng Anh"
            subtitle="Bắt đầu từ 100.000 trẻ đọc trọn vẹn 10 cuốn truyện tiếng Anh đầu tiên, không chỉ đọc chữ, mà hiểu câu chuyện, đọc thành tiếng và nói lại được điều mình đã đọc."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-brand-green rounded-[2rem] p-8 lg:p-10 text-white shadow-xl flex flex-col h-full transform hover:-translate-y-1 transition duration-300">
              <h3 className="font-bold text-xl mb-4">Sứ mệnh</h3>
              <p className="text-brand-light text-sm leading-relaxed">
                Giúp trẻ 5+ bắt đầu đọc truyện tiếng Anh theo cách nhẹ nhàng, có hướng dẫn và có đầu ra sau khi đọc.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 shadow-sm flex flex-col h-full transform hover:-translate-y-1 transition duration-300">
              <h3 className="font-bold text-brand-green text-xl mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Readizen hướng tới việc giúp 1 triệu trẻ em Việt Nam hình thành thói quen đọc tiếng Anh từ những cuốn truyện đầu tiên.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 shadow-sm flex flex-col h-full transform hover:-translate-y-1 transition duration-300">
              <h3 className="font-bold text-brand-green text-xl mb-4">Mục tiêu khởi đầu</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Với mỗi trẻ, hành trình có thể bắt đầu từ 10 cuốn truyện Readizen đầu tiên: không chỉ đọc, hiểu mà còn nói lại được điều mình đã đọc bằng tiếng Anh đơn giản.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: LỘ TRÌNH PHÁT TRIỂN ================= */}
      <section className="bg-brand-cream py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 text-left">
            <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Hành trình Readizen
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Hãy bắt đầu với Readizen Set 1
            </h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Readizen Set 1 là bước đầu tiên trong hành trình xây dựng hệ thống truyện tiếng Anh luyện đọc có hướng dẫn cho trẻ. Set 1 tập trung vào trải nghiệm khởi đầu: câu chuyện vừa sức, app hỗ trợ đọc, hoạt động nói lại và feedback sau khi đọc.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trong các giai đoạn tiếp theo, Readizen sẽ tiếp tục phát triển thêm level, nội dung truyện và trải nghiệm hỗ trợ phụ huynh dựa trên phản hồi thực tế từ trẻ, gia đình và giáo viên.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-default">
              <div className="w-12 h-12 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-sm flex-shrink-0">01</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Set 1</h4>
                <p className="text-xs text-gray-500">5 truyện đầu tiên cho trẻ 5+ bắt đầu luyện đọc có hướng dẫn.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-default">
              <div className="w-12 h-12 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-sm flex-shrink-0">02</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Mở rộng level</h4>
                <p className="text-xs text-gray-500">Phát triển thêm các set/level để trẻ tiếp tục đọc theo trình độ.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-default">
              <div className="w-12 h-12 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-sm flex-shrink-0">03</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Cải thiện app và phản hồi</h4>
                <p className="text-xs text-gray-500">Tối ưu cách con luyện đọc, gửi bài nói và nhận phản hồi.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-default">
              <div className="w-12 h-12 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-sm flex-shrink-0">04</div>
              <div>
                <h4 className="font-bold text-green-900 text-sm mb-1">Cộng đồng phụ huynh đọc cùng con</h4>
                <p className="text-xs text-gray-500">Hỗ trợ gia đình xây dựng routine đọc bền vững hơn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: FINAL CTA ================= */}
      <CTABanner
        title="Bắt đầu luyện đọc tiếng Anh cùng Readizen Set 1"
        subtitle="Khám phá cách Readizen giúp trẻ 5+ đọc truyện tiếng Anh có hướng dẫn tại nhà."
        primaryText="Xem Readizen Set 1"
        primaryHref="/library"
        secondaryText="Tìm hiểu cách học Readizen"
        secondaryHref="/learn"
      />

      {/* ================= SECTION 10: FAQ ================= */}
      <FAQSection
        badge="FAQ"
        title="Câu hỏi thường gặp về Readizen"
        items={faqAbout}
      />

      <Footer />
    </div>
  );
}