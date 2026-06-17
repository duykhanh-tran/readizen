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
import { faqPractice } from '../data/faqData.js';

export default function Practice() {
  return (
    <div className="min-h-screen bg-brand-cream text-gray-800 font-sans antialiased selection:bg-brand-light/40 overflow-x-hidden">
      <Header />

      {/* ================= SECTION 1: HERO ================= */}
      <header className="relative w-full py-16 lg:py-24 min-h-[680px] flex items-center overflow-hidden font-sans">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/practice1.jpg"
            alt="Mẹ và bé đang đọc sách Readizen"
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
              Reading cho phụ huynh mới bắt đầu
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Luyện đọc tại nhà
            </h1>

            <p className="text-xl lg:text-2xl text-gray-800 mb-8 max-w-2xl leading-relaxed font-medium">
              Trẻ 5+ cần giáo viên hoặc bố mẹ giỏi tiếng Anh để dạy con đọc. Hoặc con cần giải pháp để có thể tự mình luyện tập và đọc thành công sách tiếng Anh.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/learn"
                className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-10 py-4 rounded-full font-bold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Hiểu cách luyện đọc trong 3 phút
              </Link>
              <Link
                to="/learn"
                className="bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-brand-green transition-all duration-300 text-gray-800 hover:text-brand-green px-10 py-4 rounded-full font-bold text-lg text-center shadow-md hover:shadow-lg"
              >
                Xem cách Readizen triển khai
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SECTION 2: VẤN ĐỀ THƯỜNG GẶP ================= */}
      <section className="bg-white py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="text-left">
            <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Vấn đề thường gặp
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              4-0 khi con tự luyện đọc
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Theo phương pháp truyền thống, phụ huynh mua sách đọc tiếng Anh cho con, con không đọc. Không phải vì con không thích, mà vì con cảm thấy quá khó để bắt đầu đọc.
            </p>
          </div>

          {/* Right: 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              emoji="😔"
              title="Không biết bắt đầu từ đâu"
              description="Trẻ cần biết nên nghe gì, đọc gì, đọc lại thế nào và khi đọc sai thì sửa ra sao."
              iconBg="bg-yellow-50"
              iconBorder="border-yellow-100"
            />
            <FeatureCard
              emoji="😖"
              title="Không có hướng dẫn nghe, đọc mẫu"
              description="Nhiều phụ huynh muốn đọc cùng con nhưng ngại phát âm sai hoặc không biết nên hỏi gì."
              iconBg="bg-yellow-50"
              iconBorder="border-yellow-100"
            />
            <FeatureCard
              emoji="📸"
              title="Không tạo được hứng thú để đọc"
              description="Biết từ riêng lẻ không đồng nghĩa với việc con hiểu được một câu chuyện."
              iconBg="bg-blue-50"
              iconBorder="border-blue-100"
            />
            <FeatureCard
              emoji="❓"
              title="Không kết nối được nội dung"
              description="Nếu chỉ đọc vài câu rồi đóng sách, phụ huynh khó biết con hiểu hay chỉ đọc theo âm thanh."
              iconBg="bg-orange-50"
              iconBorder="border-orange-100"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: KHI NÀO CẦN ================= */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Giải pháp mới "
            title="Đọc tại nhà cùng Readizen"
            subtitle="Readizen giúp con từng bước làm quen, hiểu, luyện tập và thực hành nói lại câu chuyện đã đọc."
          />

          {/* Đã sửa lưới thành chia 4 cột (lg:grid-cols-4), chia 2 cột trên tablet (sm:grid-cols-2) và căn giữa bằng mx-auto, giới hạn max-w-6xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-left max-w-6xl mx-auto">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">📚</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Nội dung phù hợp</h4>
              <p className="text-gray-500 text-xs">Câu ngắn, từ vựng có kiểm soát, tranh rõ và nội dung gần gũi.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-xl">💡</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Luyện đọc từng bước</h4>
              <p className="text-gray-500 text-xs">Con được nghe trước cách đọc từ và câu, thay vì tự đoán phát âm.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 text-xl">💬</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Hoạt động tương tác</h4>
              <p className="text-gray-500 text-xs">Con nói lại điều đã hiểu, trả lời câu hỏi hoặc làm một nhiệm vụ nhỏ.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-xl">✨️</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Phản hồi bài đọc</h4>
              <p className="text-gray-500 text-xs">Con hoặc phụ huynh biết phần đọc đang ổn ở đâu, cần luyện thêm ở đâu</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: BA MẸ ĐỒNG HÀNH ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            badge="Ba mẹ đồng hành thế nào?"
            title="Thành phần trong hệ thống"
            subtitle="Vai trò của ba mẹ không phải là dạy toàn bộ, mà là tạo thói quen, ngồi cùng con và khích lệ con đọc. Các phần chuyên môn đã có App và Giáo viên hỗ trợ."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <FeatureCard
              emoji="📱"
              title="App hỗ trợ phần kỹ thuật"
              description="Đọc mẫu, ghi âm, hỗ trợ phản hồi và dẫn con qua từng hoạt động."
              iconBg="bg-blue-50"
              iconBorder="border-blue-100"
            />
            <FeatureCard
              emoji="👨‍👩‍👧"
              title="Phụ huynh hỗ trợ cảm xúc"
              description="Ngồi cạnh con, khen khi con dám đọc, hỏi câu đơn giản về tranh và duy trì thói quen."
              iconBg="bg-yellow-50"
              iconBorder="border-yellow-100"
            />
            <FeatureCard
              emoji="👩‍🏫"
              title="Giáo viên hỗ trợ chuyên môn"
              description="Nhận xét bài nói, gợi ý điểm cần cải thiện và khích lệ con sau mỗi bài Presentation."
              iconBg="bg-green-50"
              iconBorder="border-green-100"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: ĐỊNH NGHĨA 6 YẾU TỐ ================= */}
      <section className="bg-brand-cream py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Định nghĩa đơn giản"
            title="Luyện đọc có hướng dẫn là khi con không phải tự xoay xở với cuốn sách"
            subtitle="Con được dẫn từng bước để hiểu câu chuyện, đọc thành tiếng và nói lại điều đã đọc."
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-left">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">📗</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Truyện phù hợp trình độ</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Câu ngắn, từ vựng có kiểm soát, tranh rõ và nội dung gần gũi.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">🖼️</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Tranh giúp con hiểu</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Hình ảnh giúp con đoán nghĩa, hiểu nhân vật và biết chuyện gì đang diễn ra.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">💡</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Có đọc mẫu</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Con được nghe trước cách đọc từ và câu, thay vì tự đoán phát âm.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">📖</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Có cơ hội đọc lại</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Con đọc lại câu ngắn nhiều lần trong bối cảnh vui, không phải lặp máy móc.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">✨</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Có phản hồi</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Con hoặc phụ huynh biết phần đọc đang ổn ở đâu, cần luyện thêm ở đâu.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">💬</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Có đầu ra sau khi đọc</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Con nói lại điều đã hiểu, trả lời câu hỏi hoặc làm một nhiệm vụ nhỏ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: SO SÁNH NHANH ================= */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="So sánh nhanh"
            title="Khác biệt giữa 2 cách luyện đọc"
            subtitle="Sách tốt rất quan trọng. Nhưng với trẻ mới bắt đầu, cách dùng sách còn quan trọng không kém."
          />

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm text-left">
            <table className="w-full text-sm md:text-base border-collapse">
              <thead>
                <tr>
                  <th className="w-1/2 p-5 md:p-6 bg-brand-dark text-white font-bold border-r border-brand-dark">Khi con tự đọc một mình</th>
                  <th className="w-1/2 p-5 md:p-6 bg-brand-green text-brand-yellow font-bold">Khi con luyện đọc có hướng dẫn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-5 md:p-6 border-b border-r border-gray-200 text-gray-600">Con dễ bỏ cuộc nếu gặp từ khó.</td>
                  <td className="p-5 md:p-6 border-b border-gray-200 text-brand-green font-semibold bg-brand-cream/50">Con được chuẩn bị từ mới trước khi đọc.</td>
                </tr>
                <tr>
                  <td className="p-5 md:p-6 border-b border-r border-gray-200 text-gray-600">Không biết phát âm đúng hay sai.</td>
                  <td className="p-5 md:p-6 border-b border-gray-200 text-brand-green font-semibold bg-brand-cream/50">Có đọc mẫu để con nghe trước.</td>
                </tr>
                <tr>
                  <td className="p-5 md:p-6 border-b border-r border-gray-200 text-gray-600">Phụ huynh khó biết con hiểu gì.</td>
                  <td className="p-5 md:p-6 border-b border-gray-200 text-brand-green font-semibold bg-brand-cream/50">Có câu hỏi, nhiệm vụ và hoạt động nói lại.</td>
                </tr>
                <tr>
                  <td className="p-5 md:p-6 border-b border-r border-gray-200 text-gray-600">Đọc xong là hết.</td>
                  <td className="p-5 md:p-6 border-b border-gray-200 text-brand-green font-semibold bg-brand-cream/50">Có phản hồi và động lực đọc tiếp.</td>
                </tr>
                <tr>
                  <td className="p-5 md:p-6 border-r border-gray-200 text-gray-600">Sách dễ trở thành đồ để trên kệ.</td>
                  <td className="p-5 md:p-6 text-brand-green font-semibold bg-brand-cream/50">Sách trở thành một hoạt động tại nhà.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: KẾT QUẢ KHÔNG CHỈ LÀ SỐ TRANG ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Kết quả nên kỳ vọng"
            title="Kết quả không chỉ là số trang con đọc"
            subtitle="Mục tiêu không phải là đọc thật nhiều ngay lập tức. Mục tiêu là giúp con hình thành thói quen đọc tiếng Anh đúng cách."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-3 text-lg">🙂</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Tự tin mở sách hơn</h4>
              <p className="text-gray-500 text-xs">Con không còn cảm giác "con không biết đọc cái này".</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-3 text-lg">📖</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Đọc câu ngắn rõ hơn</h4>
              <p className="text-gray-500 text-xs">Con quen với việc nghe mẫu, đọc lại và tự điều chỉnh.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-3 text-lg">💡</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Hiểu câu chuyện tốt hơn</h4>
              <p className="text-gray-500 text-xs">Con biết nhìn tranh, theo dõi nhân vật và đoán nghĩa trong ngữ cảnh.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-3 text-lg">💬</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Có nội dung để nói</h4>
              <p className="text-gray-500 text-xs">Con không nói câu rời rạc, mà nói lại từ câu chuyện đã đọc và hiểu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROMO BANNER WITH BACKGROUND ================= */}
      <section className="relative w-full p-8 md:p-12 lg:p-16 overflow-hidden bg-white shadow-sm flex items-center min-h-[460px] text-left">
        <div className="absolute inset-0 z-0 opacity-40 blur-[1px] pointer-events-none select-none">
          <SafeImage
            src="/assets/home1.jpg"
            alt="Readizen Set 1 Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/30 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
              Bắt đầu bằng gì?
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              Readizen Set 1 — Bộ 5 truyện tiếng Anh đầu tiên cho trẻ 5+
            </h2>

            <p className="text-gray-600 mb-6 text-sm lg:text-base max-w-3xl leading-relaxed">
              Set 1 giúp con làm quen với việc luyện đọc có hướng dẫn: đọc sách, nghe mẫu, luyện đọc, thực hành nói và nhận phản hồi chi tiết từ hệ thống.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-xs lg:text-sm">5 truyện tiếng Anh đúng trình độ bắt đầu.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-xs lg:text-sm">App đi kèm để nghe mẫu và luyện đọc.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-xs lg:text-sm">AI feedback và phản hồi giáo viên.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-800 font-semibold text-xs lg:text-sm">Green Map, XP và Hạt Giống tạo động lực.</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-gray-100">
              <Link to="/product" className="bg-brand-green hover:bg-brand-dark transition-all duration-300 text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg">
                Xem Readizen Set 1
              </Link>
              <Link to="/tech" className="text-brand-green font-bold hover:text-brand-dark transition-colors inline-flex items-center text-sm group">
                Khám phá Công nghệ Readizen
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: ĐỌC ĐƯỢC TRƯỚC KHI ĐỌC GIỎI ================= */}
      <section className="bg-brand-cream py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Vì sao trẻ 5+ cần cách này?"
            title="Con cần đọc được trước khi đọc giỏi"
            subtitle="Ở giai đoạn đầu, nếu câu quá dài, từ quá khó hoặc hình ảnh không hỗ trợ đủ, trẻ dễ nghĩ rằng đọc tiếng Anh là việc khó. Con cần có đủ niềm tin là mình có thể đọc tốt các cuốn sách."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left mb-16">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">🔄</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Cần sự lặp lại</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Cấu trúc câu lặp giúp trẻ dự đoán được câu tiếp theo và tự tin hơn.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">🖼️</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Cần tranh để hiểu</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Tranh giúp trẻ "đọc" câu chuyện trước khi đọc chữ trôi chảy.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">🌤️</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Cần phản hồi nhẹ nhàng</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Phản hồi giúp con biết mình đang tiến bộ, không tạo cảm giác bị kiểm tra nặng nề.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-lg sm:text-xl">🌱</div>
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Cần động lực vui</h4>
              <p className="text-gray-500 text-xs sm:text-sm">Nhân vật, nhiệm vụ, huy hiệu, cây xanh hoặc bản đồ giúp con muốn quay lại.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FAQ ================= */}
      <FAQSection
        badge="FAQ"
        title="Câu hỏi thường gặp"
        items={faqPractice}
      />

      {/* ================= SECTION 11: FINAL CTA ================= */}
      <CTABanner
        title="Sẵn sàng để con bắt đầu luyện đọc tiếng Anh có hướng dẫn?"
        subtitle="Readizen Set 1 giúp con bắt đầu bằng 5 câu chuyện vừa sức, app đọc mẫu, AI feedback và hoạt động nói lại sau khi đọc."
        primaryText="Bắt đầu với Set 1"
        primaryHref="/product"
        secondaryText="Xem cách học Readizen"
        secondaryHref="/learn"
      />

      <Footer />
    </div>
  );
}