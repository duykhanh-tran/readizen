import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SafeImage from '../components/shared/SafeImage.jsx';
import FeatureCard from '../components/shared/FeatureCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import CTABanner from '../components/shared/CTABanner.jsx';
import FAQSection from '../components/shared/FAQSection.jsx';
import { faqLearn } from '../data/faqData.js';

export default function Learn() {
  return (
    <div className="min-h-screen bg-brand-cream text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-16 lg:py-20 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/m1.jpg"
            alt="Bé gái đang ngồi đọc sách Readizen"
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
              Học phần của Sách
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              5 học phần trong <br />mỗi cuốn Readizen
            </h1>

            <p className="text-xl lg:text-2xl text-gray-800 mb-8 max-w-2xl leading-relaxed font-medium">
              Với Readizen, con không chỉ đọc, mà còn tương tác và thực hành kỹ năng nói với phụ huynh.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/library"
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Xem ví dụ một cuốn sách
              </Link>
              <Link
                to="/library"
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Bắt đầu với Set 1
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ================= SECTION 2: 5 BƯỚC TỔNG QUAN ================= */}
      <section className="bg-white py-20 lg:py-24 rounded-t-[3rem] -mt-8 relative z-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-yellow-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeader
            badge="Hành trình đọc"
            title="Từ làm quen đến đọc, hiểu và nói"
            subtitle="5 học phần giúp con từng bước hoàn thành đọc sách. Con làm quen từ mới, đọc truyện, thực hành ngôn ngữ và tạo kết quả đầu ra sau khi đọc."
          />

          <div className="relative mt-10 lg:mt-14">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-gray-200" />

            {/* Luôn cố định 5 khối trên 1 hàng */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-6">
              {[
                {
                  number: "01",
                  emoji: "🔤",
                  title: "Vocab",
                  description: "Con làm quen từ mới qua tranh và bối cảnh của câu chuyện.",
                  cardBg: "bg-blue-50",
                  iconBorder: "border-blue-100",
                  badgeBg: "bg-blue-100",
                  badgeText: "text-blue-700",
                },
                {
                  number: "02",
                  emoji: "📚",
                  title: "Story",
                  description: "Đọc câu chuyện ngắn, phù hợp trình độ, có nhân vật và tình huống.",
                  cardBg: "bg-green-50",
                  iconBorder: "border-green-100",
                  badgeBg: "bg-green-100",
                  badgeText: "text-green-700",
                },
                {
                  number: "03",
                  emoji: "🌍",
                  title: "Impact",
                  description: "Con hiểu ý nghĩa câu chuyện và làm một nhiệm vụ nhỏ.",
                  cardBg: "bg-yellow-50",
                  iconBorder: "border-yellow-100",
                  badgeBg: "bg-yellow-100",
                  badgeText: "text-yellow-700",
                },
                {
                  number: "04",
                  emoji: "💬",
                  title: "Speak",
                  description: "Phụ huynh và Con cùng thực hành hội thoại theo nội dung trong sách.",
                  cardBg: "bg-gray-50",
                  iconBorder: "border-gray-200",
                  badgeBg: "bg-gray-200",
                  badgeText: "text-gray-700",
                },
                {
                  number: "05",
                  emoji: "🎤",
                  title: "Show & Tell",
                  description: "Tạo bài nói cá nhân hóa dựa nội dung chung của sách.",
                  cardBg: "bg-purple-50",
                  iconBorder: "border-purple-100",
                  badgeBg: "bg-purple-100",
                  badgeText: "text-purple-700",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`group relative ${item.cardBg} rounded-2xl lg:rounded-[2rem] p-2.5 sm:p-4 lg:p-6 border border-white/70 shadow-sm hover:shadow-xl hover:-translate-y-1 lg:hover:-translate-y-2 transition-all duration-300`}
                >
                  {/* Step badge */}
                  <div
                    className={`absolute -top-3 right-2 lg:right-6 ${item.badgeBg} ${item.badgeText} border border-white shadow-sm rounded-full px-2 lg:px-3 py-0.5 lg:py-1 text-[9px] lg:text-xs font-bold`}
                  >
                    {item.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-white ${item.iconBorder} border flex items-center justify-center text-xl sm:text-2xl lg:text-4xl mb-3 lg:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.emoji}
                  </div>

                  <h3 className="text-[11px] sm:text-sm lg:text-xl font-bold text-gray-900 mb-1.5 lg:mb-3 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-[9px] sm:text-[11px] lg:text-sm leading-4 lg:leading-6">
                    {item.description}
                  </p>

                  <div className="mt-3 lg:mt-6 h-1 lg:h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-white rounded-full group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: VIDEO DEMO ================= */}
      <section className="bg-brand-cream py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video Player */}
            <div className="w-full aspect-video bg-gray-900 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-lg border-4 border-white">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/X0t1Ld1tUGY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Nội dung */}
            <div className="text-left">
              <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
                Video demo
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                A Little Plant
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Video thực tế con đọc câu chuyện về A Little Plant.
              </p>

              {/* <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-medium">Con mở sách và nhìn tranh.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-medium">App đọc mẫu, con đọc lại và ghi âm.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-medium">Con tự trình bày lại câu chuyện và nhận feedback.</span>
                </li>
              </ul> */}

              <a href="#" className="inline-flex items-center text-brand-green font-bold hover:text-brand-dark transition text-sm">
                Tải PDF The Little Land
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: 4 LỚP HỖ TRỢ ================= */}
      <section className="bg-white py-20 lg:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          <div className="absolute top-10 left-8 w-56 h-56 bg-green-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-24 right-8 w-60 h-60 bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-8 left-1/2 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-50 -translate-x-1/2" />
          <div className="absolute bottom-16 right-1/4 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative">
          <SectionHeader
            badge="Hỗ trợ học tập "
            title="Tất cả để con đọc được"
            subtitle="Sách, app, phụ huynh và giáo viên phối hợp để giúp con tự tin bắt đầu, luyện tập và tạo kết quả đầu ra tốt hơn."
          />

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
            {[
              {
                emoji: "📚",
                title: "Sách",
                description: "Cho con câu chuyện, tranh, nhân vật và câu đọc vừa trình độ.",
                cardStyle: "bg-green-50/30 hover:bg-white border-green-100/50 hover:border-green-300 hover:shadow-green-900/5",
                iconBg: "bg-gradient-to-br from-green-50 to-green-100/60",
                iconBorder: "border-green-200/40",
                badgeBg: "bg-green-100/70 border-green-200/50",
                badgeText: "text-green-700",
                indicatorBg: "bg-green-600",
              },
              {
                emoji: "📱",
                title: "App",
                description: "Giúp việc đọc trở nên hấp dẫn và hiệu quả hơn với AI.",
                cardStyle: "bg-blue-50/30 hover:bg-white border-blue-100/50 hover:border-blue-300 hover:shadow-blue-900/5",
                iconBg: "bg-gradient-to-br from-blue-50 to-blue-100/60",
                iconBorder: "border-blue-200/40",
                badgeBg: "bg-blue-100/70 border-blue-200/50",
                badgeText: "text-blue-700",
                indicatorBg: "bg-blue-600",
              },
              {
                emoji: "👨‍👩‍👧",
                title: "Phụ huynh",
                description: "Tương tác, khích lệ và duy trì thói quen cho con.",
                cardStyle: "bg-yellow-50/30 hover:bg-white border-yellow-100/50 hover:border-yellow-300 hover:shadow-yellow-900/5",
                iconBg: "bg-gradient-to-br from-yellow-50 to-yellow-100/60",
                iconBorder: "border-yellow-200/40",
                badgeBg: "bg-yellow-100/70 border-yellow-200/50",
                badgeText: "text-yellow-700",
                indicatorBg: "bg-brand-yellow",
              },
              {
                emoji: "👩‍🏫",
                title: "Giáo viên",
                description: "Nhận xét bài đọc để phụ huynh biết con cần cải thiện gì.",
                cardStyle: "bg-purple-50/30 hover:bg-white border-purple-100/50 hover:border-purple-300 hover:shadow-purple-900/5",
                iconBg: "bg-gradient-to-br from-purple-50 to-purple-100/60",
                iconBorder: "border-purple-200/40",
                badgeBg: "bg-purple-100/70 border-purple-200/50",
                badgeText: "text-purple-700",
                indicatorBg: "bg-purple-600",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`group relative ${item.cardStyle} rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden`}
              >
                {/* Decorative number */}
                <div
                  className={`absolute top-4 right-4 sm:top-6 sm:right-6 ${item.badgeBg} ${item.badgeText} border rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-sm backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Soft white glow */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 sm:w-28 sm:h-28 bg-white/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 ease-out pointer-events-none" />

                {/* Icon */}
                <div
                  className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${item.iconBg} ${item.iconBorder} border flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  {item.emoji}
                </div>

                <div className="relative z-10">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 sm:mt-6 h-1 w-full bg-gray-100/85 rounded-full overflow-hidden">
                    <div className={`h-full w-6 rounded-full ${item.indicatorBg} opacity-80 group-hover:w-full transition-all duration-700 ease-out`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: KẾT QUẢ ================= */}
      <section className="bg-brand-cream py-24 relative overflow-hidden">
        {/* Subtle background waves/dots to flow nicely */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute -bottom-12 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
          <SectionHeader
            badge="Kết quả đọc"
            title="Luyện đọc để luyện nói"
            subtitle="Mỗi cuốn Readizen đều hướng đến mục tiêu nhỏ nhưng rõ ràng: đọc, hiểu và nói lại câu truyện đã đọc."
          />

          <div className="relative mt-16">
            {/* Connection Line with Gradient */}
            <div className="absolute top-[32px] sm:top-[60px] lg:top-[68px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-brand-green/30 via-yellow-400/40 to-blue-400/30 z-0 pointer-events-none" />

            <div className="grid grid-cols-3 gap-3 sm:gap-8 lg:gap-10 text-left relative z-10">
              {/* Card 1 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-3 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 border border-gray-100/80 hover:border-brand-green/20 flex flex-col hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Large Background number */}
                <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-4xl sm:text-7xl lg:text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  01
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-light text-brand-green rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-brand-green/10 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-xs sm:text-xl text-gray-900 mb-1.5 sm:mb-3">Đọc được</h4>
                  <p className="text-gray-600 text-[10px] leading-3.5 sm:text-sm sm:leading-relaxed">
                    Con đọc các câu ngắn trong truyện với sự hỗ trợ của app.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-3 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-yellow-500/5 border border-gray-100/80 hover:border-yellow-400/20 flex flex-col hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Large Background number */}
                <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-4xl sm:text-7xl lg:text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  02
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-50 text-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-yellow-100/80 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-xs sm:text-xl text-gray-900 mb-1.5 sm:mb-3">Hiểu được</h4>
                  <p className="text-gray-600 text-[10px] leading-3.5 sm:text-sm sm:leading-relaxed">
                    Con hiểu nhân vật, tình huống và ý chính qua tranh, câu hỏi và nhiệm vụ.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white/90 backdrop-blur-sm p-3 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 border border-gray-100/80 hover:border-blue-400/20 flex flex-col hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden">
                {/* Large Background number */}
                <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-4xl sm:text-7xl lg:text-8xl font-black text-gray-50/80 select-none pointer-events-none group-hover:text-gray-100/90 group-hover:-translate-y-2 transition-all duration-500 ease-out">
                  03
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-blue-100/80 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-xs sm:text-xl text-gray-900 mb-1.5 sm:mb-3">Nói lại được</h4>
                  <p className="text-gray-600 text-[10px] leading-3.5 sm:text-sm sm:leading-relaxed">
                    Con trình bày một phần nội dung hoặc bài học của câu chuyện.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: SET 1 PROMO ================= */}
      <section className="bg-gradient-to-br from-brand-green to-brand-dark py-16 relative overflow-hidden text-white w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Cột Nội dung */}
            <div className="w-full lg:col-span-6 order-2 lg:order-1 text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-brand-yellow text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                Bắt đầu bằng gì?
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Readizen Set 1<br />

              </h2>

              <p className="text-green-100/90 mb-8 text-lg leading-relaxed font-medium">
                Set 1 giúp con làm quen với việc luyện đọc có hướng dẫn: đọc sách, nghe mẫu, luyện đọc, thực hành nói và nhận phản hồi chuẩn xác.
              </p>

              <ul className="space-y-4 mb-10 text-left">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                    <Check className="w-4 h-4 text-brand-yellow" strokeWidth={3} />
                  </div>
                  <span className="text-green-50 font-medium text-base">5 truyện tiếng Anh ở trình độ bắt đầu.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                    <Check className="w-4 h-4 text-brand-yellow" strokeWidth={3} />
                  </div>
                  <span className="text-green-50 font-medium text-base">App đi kèm để nghe mẫu và luyện đọc.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                    <Check className="w-4 h-4 text-brand-yellow" strokeWidth={3} />
                  </div>
                  <span className="text-green-50 font-medium text-base">AI feedback và phản hồi giáo viên.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/20">
                    <Check className="w-4 h-4 text-brand-yellow" strokeWidth={3} />
                  </div>
                  <span className="text-green-50 font-medium text-base">Green Map, XP và Hạt Giống tạo động lực.</span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-5">
                <Link to="/library" className="bg-brand-yellow hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center text-base">
                  Xem Readizen Set 1
                </Link>
                <Link to="/tech" className="text-white font-bold hover:text-brand-yellow transition-colors inline-flex items-center text-sm group/link">
                  Khám phá Công nghệ Readizen
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Cột Hình ảnh */}
            <div className="w-full lg:col-span-6 order-1 lg:order-2">
              <div className="w-full aspect-[4/3] md:aspect-square lg:aspect-square bg-brand-darker rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white/10 group">
                <SafeImage
                  src="/assets/home2.jpg"
                  alt="Set 1 Readizen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 8: FAQ ================= */}
      <FAQSection
        badge="FAQ"
        title="Câu hỏi thường gặp"
        items={faqLearn}
      />

      {/* ================= SECTION 9: FINAL CTA ================= */}
      {/* <CTABanner
        title="Sẵn sàng để con học một cuốn truyện tiếng Anh theo cách có hướng dẫn?"
        subtitle="Readizen Set 1 giúp con bắt đầu bằng 5 câu chuyện vừa sức, app đọc mẫu, hoạt động nói lại và phản hồi sau khi đọc."
        primaryText="Bắt đầu với Set 1"
        primaryHref="/library"
        secondaryText="Luyện đọc có hướng dẫn là gì?"
        secondaryHref="/practice"
      /> */}

      <Footer />
    </div>
  );
}