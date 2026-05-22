import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden">
      <Header />
      
      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-4 lg:py-8 min-h-[550px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/home1.jpg"
            alt="Bộ hộp sách và App điện thoại"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-green/20 text-brand-green text-base font-bold mb-4 shadow-sm">
              <Check className="w-5 h-5" />
              Readizen — Small Readers, Big Citizens
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Sách tiếng Anh<br />
              luyện đọc có hướng<br />
              dẫn cho trẻ 5+
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-800 mb-4 max-w-2xl leading-relaxed font-medium">
              Readizen kết hợp sách giấy, app học tập, Speech AI và phản hồi giáo viên để con nghe mẫu, đọc lại, nói lại điều đã hiểu và có động lực đọc tiếp tại nhà.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/product" 
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Bắt đầu với Set 1
              </Link>
              <Link 
                to="/practice" 
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Luyện đọc có hướng dẫn là gì?
              </Link>
            </div>
            
            <p className="text-base text-gray-700 mt-6 max-w-lg font-medium">
              Dành cho phụ huynh muốn con bắt đầu đọc truyện tiếng Anh tại nhà theo một lộ trình sáng, nhẹ nhàng và có phản hồi.
            </p>
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
              badge="Nền tảng vững chắc khi bắt đầu"
              title="Vì sao trẻ học tiếng Anh nên luyện đọc qua truyện?"
              align="left"
              className="mb-6"
            />
            <p className="text-gray-600 mb-8 text-lg">
              Truyện đưa tiếng Anh vào bối cảnh có tranh, nhân vật, hành động và cảm xúc. Nhờ đó, con không chỉ học thêm từ mới mà còn hiểu cách dùng từ, quen với mẫu câu và có nội dung để nói lại bằng tiếng Anh.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Từ vựng có ngữ cảnh</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Mẫu câu quen thuộc</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-light p-1 rounded-full"><Check className="w-5 h-5 text-brand-green" /></div>
                <span className="text-gray-800 font-medium text-lg">Có điều để nói lại</span>
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
                Vấn đề thực sự
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Con gặp khó khăn khi tự luyện đọc
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Với trẻ mới bắt đầu, vấn đề không phải là thiếu sách mà là con không chọn được sách phù hợp và các chỉ dẫn để đọc có ý thức và hiệu quả.
              </p>
              <Link to="/practice" className="inline-flex items-center text-brand-green font-bold hover:text-brand-dark transition-colors">
                Tìm hiểu truyện đọc có hướng dẫn 
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                emoji="📚"
                title="Nội dung vượt trình độ"
                description="Nếu câu dài, từ khó hoặc tranh không rõ, con dễ nản ngay từ những trang đầu."
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
                title="Đọc xong rồi dừng"
                description="Nếu không có hoạt động nói lại, reading khó đổi sang speaking."
                iconBg="bg-purple-50"
                iconBorder="border-purple-100"
              />
            </div>
          </div>
          
          <div className="bg-brand-green rounded-[2rem] p-10 lg:p-16 text-center text-white relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-4 left-4 text-9xl text-white/10 font-serif pointer-events-none select-none">“</div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 relative z-10">Trẻ cần hướng dẫn để đảm bảo đọc đúng và hiệu quả</h3>
            <p className="text-brand-light text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Con cần được nghe mẫu, đọc lại, nhận phản hồi và được dẫn từng bước - để việc đọc trở nên nhẹ nhàng, rõ ràng và dễ duy trì hơn.
            </p>
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
      <section className="bg-brand-cream py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Khác gì sách tiếng Anh thông thường?"
            title="Sách thường vs Sách Readizen"
            subtitle="Readizen không cố trở thành một thư viện sách thật lớn. Readizen tập trung giúp trẻ bắt đầu luyện đọc tiếng Anh tại nhà dễ hơn, rõ hơn và có phản hồi sau khi đọc."
          />

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg text-left mb-8">
            <table className="w-full text-sm md:text-base border-collapse">
              <thead>
                <tr>
                  <th className="w-1/2 p-4 md:p-6 bg-brand-green text-white font-bold border-r border-brand-dark text-left">Sách tiếng Anh thông thường</th>
                  <th className="w-1/2 p-4 md:p-6 bg-brand-dark text-brand-yellow font-bold text-left">Readizen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 md:p-6 border-b border-r border-gray-200 text-gray-600">Mua về rồi phụ huynh tự xoay xở.</td>
                  <td className="p-4 md:p-6 border-b border-gray-200 text-brand-green font-bold bg-brand-cream/50">Có quy trình đọc từng bước.</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 border-b border-r border-gray-200 text-gray-600">Không chắc con đọc đúng chưa.</td>
                  <td className="p-4 md:p-6 border-b border-gray-200 text-brand-green font-bold bg-brand-cream/50">Có app đọc mẫu và feedback.</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 border-b border-r border-gray-200 text-gray-600">Đọc xong là hết.</td>
                  <td className="p-4 md:p-6 border-b border-gray-200 text-brand-green font-bold bg-brand-cream/50">Có hoạt động nói lại.</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 border-r border-gray-200 text-gray-600">Thiếu động lực quay lại.</td>
                  <td className="p-4 md:p-6 text-brand-green font-bold bg-brand-cream/50">Có XP, Hạt Giống và Green Map.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Link to="/learn" className="inline-flex items-center text-brand-green font-bold hover:text-brand-dark transition-colors">
            Tìm hiểu cách Readizen hoạt động <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* ================= SECTION 5: SÁCH READIZEN 3 TRONG 1 ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Readizen là gì?"
            title="Sách Readizen luyện đọc tiếng Anh 3 trong 1"
            subtitle="Mỗi cuốn truyện không đứng một mình. Con có sách để đọc, app để nghe mẫu và luyện tập, giáo viên phản hồi để biết mình tiến bộ, và Green Map để có động lực đọc tiếp."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <FeatureCard
              emoji="📚"
              title="Sách Giấy"
              description="Truyện ngắn, câu văn súc tích, tranh vẽ nhân vật vui vẻ và có tình huống để con muốn lật trang."
              iconBg="bg-green-50"
              iconBorder="border-green-100"
            />
            <FeatureCard
              emoji="📱"
              title="App Học tập"
              description="Con nghe mẫu, đọc lại, ghi âm và nhận phản hồi thay vì tự đoán cách đọc, để biết các nội dung cần điều chỉnh."
              iconBg="bg-blue-50"
              iconBorder="border-blue-100"
            />
            <FeatureCard
              emoji="👩‍🏫"
              title="Giáo viên đồng hành"
              description="Giáo viên đánh giá bài nói tổng kết cuối sách, để con biết điểm mạnh, điểm cần cải thiện trong hành trình."
              iconBg="bg-purple-50"
              iconBorder="border-purple-100"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: QUY TRÌNH HỌC VỚI READIZEN ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Cách con học với mỗi cuốn Readizen"
            title="Với Readizen, con luyện đọc, luyện âm và luyện nói"
            subtitle="Readizen biến một cuốn truyện ngắn thành một buổi luyện đọc có trình tự, giúp con không bị bỏ lại một mình với trang sách."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0"></div>

            <div className="bg-white p-8 rounded-3xl shadow-sm relative z-10 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-white">1</div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Đọc hiểu nội dung</h4>
              <p className="text-gray-500 text-sm">Con quan sát nhân vật, hành động và tình huống trước khi đọc chữ.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm relative z-10 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-white">2</div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Luyện đọc với App</h4>
              <p className="text-gray-500 text-sm">Con nghe đọc mẫu và nhận tín hiệu để biết mình đang tiến bộ ở đâu.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm relative z-10 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-white">3</div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Nói lại câu chuyện</h4>
              <p className="text-gray-500 text-sm">Con trình bày điều đã hiểu bằng tiếng Anh một cách đơn giản.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm relative z-10 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md border-4 border-white">4</div>
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Giáo viên Feedback</h4>
              <p className="text-gray-500 text-sm">Đánh giá bài nói của con, tìm ra điểm mạnh và điểm cần cải thiện.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: APP FEATURES & GREEN MAP ================= */}
      <section className="bg-gradient-to-b from-brand-green to-brand-dark py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 border border-white/10">
              App & Green Map
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              App Readizen đồng hành<br />cùng con trên từng trang sách
            </h2>
            <p className="text-brand-light text-lg opacity-90 max-w-2xl mx-auto">
              Con không chỉ đọc xong rồi đóng sách. App giúp con luyện đọc, gửi bài nói, nhận phản hồi và mở thêm tiến trình trên Green Map.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image frame */}
            <div className="bg-white/5 rounded-[2.5rem] p-2 md:p-4 w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="w-full h-full bg-black rounded-3xl overflow-hidden relative shadow-inner">
                <SafeImage
                  src="/assets/home3.png"
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
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Con nghe mẫu, đọc lại, ghi âm và nhận phản hồi.</p>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👩‍🏫</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Presentation</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Con nói lại điều đã hiểu và nhận feedback.</p>
                </div>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition duration-300 cursor-pointer p-6 rounded-2xl flex items-center gap-5 border border-white/5 shadow-sm">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Green Map</h4>
                  <p className="text-sm text-brand-light opacity-90 leading-relaxed">Đọc sách để gieo Hạt Giống và phủ xanh bản đồ.</p>
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

      {/* ================= SECTION 8: PHẢN HỒI TỪ GIÁO VIÊN ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Phản hồi từ giáo viên"
            title="Giáo viên đồng hành giúp con tự tin"
            subtitle="Sau phần con nói lại câu chuyện, giáo viên nhận xét để ba mẹ biết con đã hiểu gì, nói lại được đến đâu và rèn luyện thêm điểm nào ở nhà."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-brand-green flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-green-100">1</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Nhận xét bài nói</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Giáo viên xem phần Presentation để nhận xét cách con đọc, nói và diễn đạt lại câu chuyện.</p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-brand-green flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-green-100">2</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Điểm cần cải thiện</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Ba mẹ biết con cần chú ý phát âm, độ rõ ràng, sự tự tin hay khả năng nối lại nội dung.</p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-brand-green flex items-center justify-center font-bold text-xl mb-6 shadow-sm border border-green-100">3</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Đồng hành dễ hơn</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Thay vì tự đoán con tiến bộ đến đâu, phụ huynh có nhận xét cụ thể để tiếp tục luyện cùng con.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: READIZEN SET 1 DETAILS ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-xl border border-gray-200">
            <SafeImage src="/assets/home2.jpg" alt="Readizen Set 1" className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Bắt đầu từ đâu?
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Readizen Set 1<br />
              Bộ 5 truyện tiếng Anh<br />đầu tiên cho trẻ 5+
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Set 1 giúp con làm quen với việc luyện đọc có hướng dẫn: đọc sách, nghe mẫu, luyện đọc, thực hành nói và nhận phản hồi.
            </p>
            
            <ul className="space-y-5 mb-10 text-left">
              <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-gray-800 font-bold text-sm">5 truyện tiếng Anh ở trình độ bắt đầu.</span>
              </li>
              <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-gray-800 font-bold text-sm">App đi kèm để nghe mẫu và luyện đọc.</span>
              </li>
              <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-gray-800 font-bold text-sm">AI feedback và phản hồi giáo viên.</span>
              </li>
              <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-gray-800 font-bold text-sm">Green Map, XP và Hạt Giống tạo động lực.</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-6">
              <Link to="/product" className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:-translate-y-1">
                Xem chi tiết Set 1
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: THỰC TẾ HỌC TẬP ================= */}
      <section className="bg-white py-16 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="border-dashed rounded-3xl p-8 lg:p-12 relative bg-white">
            <SectionHeader
              badge="Thực tế không khô khan"
              title="Thực tế học tập với Readizen"
              subtitle="Hình ảnh trực quan sinh động từ sản phẩm vật lý, app đồng hành và nhận xét chuyên môn thực tế."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Card 1 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-green-50 rounded-xl mb-6 overflow-hidden border border-green-100 relative shadow-sm">
                  <SafeImage
                    src="/assets/home1.jpg"
                    alt="Ảnh sách thật"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
                  />                
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Ảnh sách thật</h4>
                <p className="text-gray-500 text-sm mb-4 flex-grow">Mở trang sách và ảnh trẻ cầm sách giúp sản phẩm bớt trừu tượng.</p>
              </div>
                    
              {/* Card 2 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-blue-50 rounded-xl mb-6 overflow-hidden border border-blue-100 relative shadow-sm">
                  <SafeImage
                    src="/assets/home3.png"
                    alt="Giao diện App Readizen"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
                  />                   
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Demo app</h4>
                <p className="text-gray-500 text-sm mb-4 flex-grow">Trẻ nghe mẫu, đọc lại, ghi âm và nhận feedback sau khi đọc.</p>
              </div>
                    
              {/* Card 3 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-yellow-50 rounded-xl mb-6 overflow-hidden border border-yellow-100 relative shadow-sm">
                  <SafeImage
                    src="/assets/home2.jpg"
                    alt="Feedback mẫu"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
                  />                   
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Feedback mẫu</h4>
                <p className="text-gray-500 text-sm mb-4 flex-grow">Cho phụ huynh thấy giáo viên nhận xét bài Presentation như thế nào.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 11: CÓ THỂ BA MẸ QUAN TÂM ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Bạn muốn tìm hiểu thêm thông tin?"
            title="Có thể ba mẹ quan tâm"
            subtitle="Homepage không cần giải thích hết. Hãy đi sâu vào phần đúng với điều bạn đang thắc mắc."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 font-bold text-2xl border border-red-100">?</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Tôi chưa hiểu reading/luyện đọc</h4>
              <p className="text-gray-500 text-sm mb-8 flex-grow">Tìm hiểu vì sao trẻ cần luyện đọc có hướng dẫn trước khi bắt đầu.</p>
              <Link to="/practice" className="text-brand-green font-bold hover:text-brand-dark transition-colors text-sm flex items-center">
                Luyện đọc có hướng dẫn là gì? <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 font-bold text-2xl border border-blue-100">⚙️</div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Tôi muốn biết Readizen học thế nào</h4>
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
              <Link to="/product" className="text-brand-green font-bold hover:text-brand-dark transition-colors text-sm flex items-center">
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
        title="Trải nghiệm luyện đọc với Readizen Set 1"
        subtitle="Readizen Set 1 giúp con bắt đầu bằng 5 câu chuyện vừa sức, app đọc mẫu, AI feedback và hoạt động nói lại sau khi đọc."
        primaryText="Bắt đầu với Set 1"
        primaryHref="/product"
        secondaryText="Tìm hiểu cách học Readizen"
        secondaryHref="/learn"
      />
      
      <Footer />
    </div>
  );
}

export default App;
