import React from 'react';
import FAQList from '../FAQList.jsx';

const FAQSection = ({ 
  badge = "FAQ", 
  title = "Câu hỏi thường gặp", 
  items 
}) => {
  return (
    <section className="bg-brand-cream pb-24 pt-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-block bg-brand-light text-brand-green text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-6">
            {badge}
          </div>
        )}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
          {title}
        </h2>
        <FAQList items={items} />
      </div>
    </section>
  );
};

export default FAQSection;
