import React from 'react';

const CTABanner = ({ 
  title, 
  subtitle, 
  primaryText = "Bắt đầu với Set 1", 
  primaryHref = "#",
  primaryOnClick,
  secondaryText = "Luyện đọc có hướng dẫn là gì?",
  secondaryHref = "#"
}) => {
  return (
    <section className="bg-gradient-to-br from-brand-green to-brand-darker py-20 text-center text-white relative overflow-hidden">
      {/* Light effect overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-brand-light opacity-90 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-5">
          {primaryOnClick ? (
            <button 
              onClick={primaryOnClick} 
              className="bg-brand-yellow hover:bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              {primaryText}
            </button>
          ) : (
            <a 
              href={primaryHref} 
              className="bg-brand-yellow hover:bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              {primaryText}
            </a>
          )}
          {secondaryText && (
            <a 
              href={secondaryHref} 
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300 px-10 py-4 rounded-full font-bold shadow-md hover:-translate-y-1"
            >
              {secondaryText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
